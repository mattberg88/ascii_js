class Obj extends PIXI.Text {
  constructor(id, x, y, name, char, color, rgdbdy, bounceFactor){
    super()
    this.id = id
    this.x = x
    this.y = y
    this.bitX = x
    this.bitY = y
    this.lastX=x
    this.lastY=y
    this.inertiaX=0
    this.inertiaY=0
    this.name = name
    this._text = char
    this._style.fontFamily = 'Arial'
    this._style.fill = color
    this._style.fontSize= 20
    this.rgdbdy = rgdbdy
    this.velocityX = 0
    this.velocityY = 0
    this.lastCollided = []
    this.bounceFactor = bounceFactor
  }

  /**
   * @param bm existing map of screen area with ids
   * @returns any units surrounding this unit by COLLISION_MAP_SIZE
   */
  bitmap_to_cm(bm) {
    let bitArray = []
    for(let i =0; i < COLLISION_MAP_SIZE; i+=1){
      let bits = []
      for(let j=0; j < COLLISION_MAP_SIZE; j+=1){
         bits.push(bm[this.y + i - COLLISION_DIST][this.x + j - COLLISION_DIST] || 0)
      }
      bitArray.push(bits)
    }
    return bitArray
  }

   /**
   * @param cm 3x3 matrix of bits from bitmap with unit at center
   * @returns the direction unit should bounce to according to surrounding units
   */
  collision_to_vec(cm) {
    let collide_direction = {x:0, y:0}
    for(let i =0; i < COLLISION_MAP_SIZE; i+=1){
      for(let j=0; j < COLLISION_MAP_SIZE; j+=1){
        if(cm[j][i] != 0 && cm[j][i] != this.id) {
          collide_direction.x += (i - COLLISION_DIST) * SPEED_CHART[cm[j][i]]
          collide_direction.y += (j - COLLISION_DIST) * SPEED_CHART[cm[j][i]]
        }
      }
    }
    return {x: -collide_direction.x, y: -collide_direction.y}
  }


  /**
   * tells which way bit should move if it collides with something y[0]x[0] is the bottom right, y[2]x[2] is the top left
   * @param col_map 3x3 matrix of bits from bitmap with unit at center
   */
  bit_to_move(col_map) {
    if(col_map[COLLISION_DIST + 1][COLLISION_DIST] == 0) {
      this.bitX -= 0.1
    } else if(col_map[COLLISION_DIST + 1][COLLISION_DIST + 2] == 0) {
      this.bitX += 0.1
    } else if(col_map[COLLISION_DIST][COLLISION_DIST + 1] == 0) {
      this.bitY -= 0.1
    } else if(col_map[COLLISION_DIST + 2][COLLISION_DIST + 1] == 0) {
      this.bitY += 0.1
    }
  }

  /**
   * keeps units from going out of frame
   * @param bd how many bits from border unit should stay within
   */
  apply_threshold(bd) {
    if(this.bitX >= WIDTH - bd) {
      this.bitX = WIDTH - bd
      this.inertiaX *= - 1
    }
    if(this.bitX <= bd) {
      this.bitX = bd
      this.inertiaX *= - 1
    }
    if(this.bitY <= bd) {
      this.bitY = bd
      this.inertiaY *= - 1
    }
    if(this.bitY >= HEIGHT - bd){
      this.bitY = HEIGHT - bd
      this.inertiaY *= - 1
    }
  }

  /**
   * detects collisions usint a collision map from bit map, then controls physics of unit
   * @param bitmap a map of all the bits within frame, 0 = nothing, if not zero then the unit's id
   */
  detect_collisions(bitmap) {
    let cm = this.bitmap_to_cm(bitmap)
    // make function for actual collision detection
    // console.log(cm)
    let bounce_vector = this.collision_to_vec(cm)
    let c_mag = get_magnitude(bounce_vector.x, bounce_vector.y)
    if(c_mag > 0) {
      logBitMap(cm)
      this.inertiaX += bounce_vector.x/c_mag * this.bounceFactor
      this.inertiaY += bounce_vector.y/c_mag * this.bounceFactor

    }
    if(this.inertiaX > 0) this.inertiaX -= DECAY_RATE * this.inertiaX
    if(this.inertiaX < 0) this.inertiaX += DECAY_RATE * - this.inertiaX
    if(this.inertiaY > 0) this.inertiaY -= DECAY_RATE * this.inertiaY
    if(this.inertiaY < 0) this.inertiaY += DECAY_RATE * - this.inertiaY




    //if nothing is under unit
    if(cm[COLLISION_DIST-1][COLLISION_DIST] == 0) {
      // this.inertiaY += GRAVITY
    }

    // if(cm[COLLISION_DIST][COLLISION_DIST] != this.id) {
    //   this.bit_to_move(cm)
    // }
  }

  update(bitmap) {
    if(this.rgdbdy) {
      this.detect_collisions(bitmap)
      this.bitX += this.inertiaX
      this.bitY += this.inertiaY
      this.apply_threshold(COLLISION_MAP_SIZE/2)
    }
    this.velocityX = this.bitX - this.lastX
    this.velocityY = this.bitY - this.lastY
    this.speed = get_magnitude(this.velocityX, this.velocityY)
    SPEED_CHART[this.id] = this.speed
    // if(this.id === 1) console.log(this.speed)
    this.lastX = this.bitX
    this.lastY = this.bitY
    this.x = Math.floor(this.bitX)
    this.y = Math.floor(this.bitY)

  }
}