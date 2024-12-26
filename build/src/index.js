let app
let mouseX, mouseY

window.onload = function() {

  app = new PIXI.Application({ width: WIDTH, height: HEIGHT })
  document.body.style.cursor = "none"
  document.body.appendChild(app.view)

  const player = new Obj(1, WIDTH/2, HEIGHT/2, 'player', 'o', 'white', false, 1)
  SPEED_CHART[1] = 0
  app.stage.addChild(player);

  const test = new Obj(2, 200, 100, 'test', 'O', 'white', true, 1)
  SPEED_CHART['2'] = 0
  app.stage.addChild(test);

  // for(let i =0; i < WIDTH; i+=1){
  //   const floor = new Obj(3, i, height - 30, 'floor', '-', 'grey', false, 0.1)
  //   SPEED_CHART['3'] = 0
  //   app.stage.addChild(floor);
  // }


  for(let i =0; i < TEST_UNITS_DIMENSION; i +=1) {
    for(let k =0; k < TEST_UNITS_DIMENSION; k +=1) {
      const unitId = i * 10 + k + 3
      const test_unit = new Obj(unitId, i * COLLISION_MAP_SIZE + 100, k * COLLISION_MAP_SIZE + 100, 'test', 'o', 'white', true, 1)
      SPEED_CHART[unitId] = 0
      app.stage.addChild(test_unit);
    }
  }
  app.ticker.add(function(delta) {
    // console.log(app.ticker._lastFrame)

    window.onpointermove = function(e){
      mouseX=e.pageX
      mouseY=e.pageY
    }

    const stagedObjs = app.stage.children
    let btmp = new_bitmap()

    stagedObjs.forEach(c => {
      if (!c.y || !c.x || !c.id) return
      btmp[c.y][c.x] = c.id
    })

    if(mouseX && mouseY) {
      player.bitX = mouseX
      player.bitY = mouseY
      player.apply_threshold(1)
    }

    stagedObjs.forEach(c => {
      // if(c.name == 'test') console.log(c.bitmap_to_cm(btmp))
      c.update(btmp, delta)
    })
  })
}