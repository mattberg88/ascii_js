let app
let mouseX, mouseY

window.onload = function() {

  app = new PIXI.Application({ width, height })
  document.body.style.cursor = "none"
  document.body.appendChild(app.view)

  const player = new Obj(1, width/2, height/2, 'player', 'o', 'white', false)
  app.stage.addChild(player);
  for(let i =0; i < 20; i +=1) {
    for(let k =0; k < 20; k +=1) {
      const test = new Obj(2, 50 + i * 10, 50 + k * 10, 'test', 'o', 'white', true)
      app.stage.addChild(test);
    }
  }
  const test = new Obj(2, 200, 100, 'test', 'O', 'white', true)
  app.stage.addChild(test);

  for(let i =0; i < bit_width; i+=1){
    const floor = new Obj(3, i*10, height - 30, 'floor', '-', 'grey', false)
    app.stage.addChild(floor);
  }

  // Listen for animate update
  app.ticker.add(function(delta) {
    window.onpointermove = function(e){
      mouseX=e.pageX
      mouseY=e.pageY
    }




    const stagedObjs = app.stage.children
    let btmp = new_bitmap()

    stagedObjs.forEach(c => {
      if (!c.bit_y || !c.bit_x || !c.id) return
      btmp[c.bit_y][c.bit_x] = c.id
    })
    if(mouseX && mouseY) {
      player.bit_x = Math.floor(mouseX/10)
      player.bit_y = Math.floor(mouseY/10)
      player.apply_threshold(2)

    }
    stagedObjs.forEach(c => {
      // if(c.name == 'test') console.log(c.bitmap_to_cm(btmp))
      c.update(btmp, delta)
    })
  })
}