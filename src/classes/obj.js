class Obj extends PIXI.Text {
  constructor(id, x, y, name, char, color, rgdbdy){
    super()
    this.id = id
    this.x = x
    this.y = y
    this.lastX=x
    this.lastY=y
    this.inertiaX=0
    this.inertiaY=0
    this.name = name
    this._text = char
    this._style.fontFamily = 'Arial'
    this._style.fill = color
    this._style.fontSize= 24
    this._anchor.x = 0.5
    this._anchor.y = 0.5
    this.energy = 1
    this.rgdbdy = rgdbdy
    this.velocityX=0
    this.velocityY=0
    this.speed=0
  }
  update(staged, delta) {
    this.velocityX = this.x - this.lastX
    this.velocityY = this.y - this.lastY
    this.speed=(Math.sqrt(this.velocityX**2 + this.velocityY**2))/100
    this.lastX = this.x
    this.lastY = this.y
    if(this.energy > 0) this.energy -= decay_rate
    if (this.y < floor && this.rgdbdy) {
      this.y += gravity*delta
    }
    staged.forEach(i => {
      if(i == this) return
      const distx = this.x - i.x
      const disty = this.y - i.y
      const dist = Math.sqrt((this.x - i.x) **2 + (this.y - i.y) **2)
      if(dist < cell_size && this.rgdbdy) {
        this.inertiaX -= distx*delta + this.velocityX
        this.inertiaY -= disty*delta+ this.velocityY
        this.energy = Math.max(this.speed - i.speed, 0)
      }
    })
    this.x += this.inertiaX * this.energy
    this.y += this.inertiaY * this.energy

  }
}