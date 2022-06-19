let app
let mouseX, mouseY
window.onload = function() {
  app = new PIXI.Application({ width, height })
  document.body.style.cursor = "none"
  document.body.appendChild(app.view)

  const player = new Obj(1, width/2, height/2, 'player', 'ï', 'white', false)
  app.stage.addChild(player);
  for(let i =1; i < 5; i +=1) {
    for(let k =1; k < 11; k +=1) {
      const test = new Obj(2, width/3 + (i * Math.random() * 10), height/3 + (k * Math.random() * 10), 'test', '.', 'white', true)
      app.stage.addChild(test);
    }
  }
  // const test = new Obj(2, 200, 100, 'test', '.', 'white', true)
  //     app.stage.addChild(test);

  for(let i =0; i < width/10; i+=1){
    const floor = new Obj(3, i*10, height - 30, 'floor', '_', 'grey', false)
    app.stage.addChild(floor);
  }


  // Listen for animate update
  app.ticker.add(function(delta) {
    player.x = mouseX
    player.y = mouseY
    const stagedObjs = app.stage.children
    stagedObjs.forEach(c => c.update(stagedObjs, delta))
      // player.rotation += 0.1 * delta;
  });

window.onpointermove = function(e){
  mouseX=e.pageX
  mouseY=e.pageY
}
}