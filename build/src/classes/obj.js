class Obj extends PIXI.Text {
  constructor(id, x, y, name, char, color, rgdbdy){
    super()
    this.id = id
    this.x = x
    this.y = y
    this.bit_x = x/cell_size
    this.bit_y = y/cell_size
    this.lastX=x
    this.lastY=y
    this.inertiaX=0
    this.inertiaY=0
    this.name = name
    this._text = char
    this._style.fontFamily = 'Arial'
    this._style.fill = color
    this._style.fontSize= 10
    this._anchor.x = 0.5
    this._anchor.y = 0.5
    this.energy = 1
    this.rgdbdy = rgdbdy
    this.velocityX=0
    this.velocityY=0
    this.speed=0
  }

  bitmap_to_cm(bm) {
    let center = bm[this.bit_y][this.bit_x] || 0
    let top = bm[this.bit_y - 1][this.bit_x] || 0
    let bottom = bm[this.bit_y + 1][this.bit_x] || 0
    let left = bm[this.bit_y][this.bit_x - 1] || 0
    let right = bm[this.bit_y][this.bit_x + 1] || 0
    let l_top = bm[this.bit_y - 1][this.bit_x - 1] || 0
    let r_top = bm[this.bit_y - 1][this.bit_x + 1] || 0
    let l_bottom = bm[this.bit_y + 1][this.bit_x - 1] || 0
    let r_bottom = bm[this.bit_y + 1][this.bit_x + 1] || 0
    return [[l_top,top,r_top], [left,center,right], [l_bottom,bottom,r_bottom]]
  }

  collision_to_vec(cm) {
    let bounce = {x:0, y:0}
    for(let i =0; i < 3; i+=1){
      for(let j=0; j < 3; j+=1){
        if(cm[j][i] != 0) {
          bounce.x += i-1
          bounce.y += j-1
        }
      }
    }
    return {x: bounce.x, y: bounce.y}
  }

  bit_to_move(col_map) {
    if(col_map[1][0] == 0) {
      this.bit_x -= 1
    } else if(col_map[1][2] == 0) {
      this.bit_x += 1
    } else if(col_map[0][1] == 0) {
      this.bit_y -= 1
    } else if(col_map[2][1] == 0) {
      this.bit_y += 1
    }
  }

  apply_threshold(bd) {
    if(this.bit_x >= bit_width - bd) {
      this.bit_x = bit_width - bd
      this.inertiaX = -1
    }
    if(this.bit_x <= bd) {
      this.bit_x = bd
      this.inertiaX = +1
    }
    if(this.bit_y <= bd) {
      this.bit_y = bd
      this.inertiaY = +1
    }
    if(this.bit_y >= bit_height - bd){
      this.bit_y = bit_height - bd
      this.inertiaY = -1
    }
  }

  detect_collisions(bitmap) {
    let cm = this.bitmap_to_cm(bitmap)
    let c_vec = this.collision_to_vec(cm)
    let c_mag = get_magnitude(c_vec.x, c_vec.y)
    if(c_mag > 0) {
      this.energy = c_mag
      let bounce = {x: Math.floor(-c_vec.x/c_mag), y: Math.floor(-c_vec.y/c_mag)}
      this.inertiaX += bounce.x * this.energy
      this.inertiaY += bounce.y * this.energy
    }
    if(this.energy > 0) {
      this.energy -= decay_rate
    } else {
      this.energy = 0
    }
    console.log(this.energy)
    if(cm[2][1] == 0) {
      // this.energy = 1

      this.bit_y += gravity
    }
    if(cm[1][1] != this.id) {
      // this.energy = 1
      this.bit_to_move(cm)
    }
  }

  update(bitmap) {
    if(this.rgdbdy) {
      this.detect_collisions(bitmap)
      this.bit_x = Math.floor(this.bit_x + this.inertiaX * this.energy)
      this.bit_y = Math.floor(this.bit_y + this.inertiaY * this.energy)
      this.apply_threshold(3)
    }
    this.velocityX = this.bit_x - this.lastX
    this.velocityY = this.bit_y - this.lastY
    this.speed=Math.sqrt(this.velocityX**2 + this.velocityY**2)
    this.lastX = this.bit_x
    this.lastY = this.bit_y
    this.x = Math.floor(this.bit_x * cell_size)
    this.y = Math.floor(this.bit_y * cell_size)

  }
}