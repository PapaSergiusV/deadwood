/*jshint esversion: 6 */
//Переменные common.js
let frame     = 0;
let screen    = document.getElementById('screen');
let ctx       = screen.getContext('2d');
let time      = new Date();
let ms        = 20;
let mapLength = 100;

//INITIALISATION OBJECTS
let wood      = new Background();
let ground    = new Ground('../img/grass.jpg', mapLength);
let player    = new Player('../img/player2.png', 16, 300, 51, 64, 3.4); player.setVars(0);
let dwood     = new Resources(ground.relief);
let scores    = new Interface(); 
let torch     = new Fire('../img/fireInTheDark.png', 1280, 800);
let rivals    = new LinkedList(/*
                new Rival('../img/player.png', 336, 300, 32, 64),
                new Rival('../img/player.png', 136, 300, 32, 64),
                new Rival('../img/player.png', 264, 300, 32, 64),
                new Rival('../img/player.png', 736, 300, 32, 64), 
                new Rival('../img/player.png', 608, 300, 32, 64),
                new Rival('../img/player.png', 496, 100, 32, 64)*/);

//GAME MAIN FUNCTION
if (ctx) setInterval(render, 25); 

function render() {
  ms = new Date() - time;
  time = new Date();

  //MECHANICS
  DWFuncs.movingManager(player, ground, dwood, ms); 
  player.gravity(ground.relief, ms);
  if (player.backZone > 5760)
    restart();

  //DRAW
  wood.draw(ctx, player);
  ground.draw(ctx, player.backZone);
  dwood.draw(ctx, player.backZone);
  player.draw(ctx);
  torch.draw(ctx, player.x, player.y - 48);
  scores.draw(ctx, player.x + player.backZone, player.y, player.point, ms);

  //CYCLES
  DWFuncs.rivalForeach(rivals.first, ctx, player.backZone, ground.relief, dwood, ms);

  frame++; 
}

//CYCLES (that don't depend on main func)
setInterval(DWFuncs.collector, 10000, (rivals));
setInterval(DWFuncs.newRival,  10000, (rivals), (player), (mapLength));

//RESTART LEVEL
function restart() {
  wood            = null;
  wood            = new Background();
  frame           = 0;
  ground          = null;
  ground          = new Ground('../img/grass.jpg', mapLength);
  dwood           = null;
  dwood           = new Resources(ground.relief);
  player.x        = 16;
  player.backZone = 0;
  while (rivals.first != null)
    rivals.removeLast();
}