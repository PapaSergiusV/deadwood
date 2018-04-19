/*jshint esversion: 6 */
//Переменные common.js
let frame     = 0;
let screen    = document.getElementById('screen');
let ctx       = screen.getContext('2d');
let time      = new Date();
let ms        = 20;
let mapLength = 100;

//Инициализация объектов классов
let wood      = new Background();
let ground    = new Ground('../img/grass.jpg', mapLength);
let player    = new Player('../img/player.png', 16, 300, 32, 64, 3.4); player.setVars(0);
let dwood     = new Resources(ground.relief);
let scores    = new Interface(); 
let torch     = new Fire('../img/fireInTheDark.png', 1280, 800);
let rivals    = new LinkedList(
                new Rival('../img/player.png', 336, 300, 32, 64),
                new Rival('../img/player.png', 136, 300, 32, 64),
                new Rival('../img/player.png', 264, 300, 32, 64),
                new Rival('../img/player.png', 736, 300, 32, 64),
                new Rival('../img/player.png', 608, 300, 32, 64),
                new Rival('../img/player.png', 496, 100, 32, 64));

//Главная функция игры
if (ctx) setInterval(render, 25); 

function render() {
  ms = new Date() - time;
  time = new Date();

  //MECHANICS
  DWFuncs.movingManager(player, ground, dwood, ms); 
  player.gravity(ground.relief, ms);

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

//Сборщик мусора
setInterval(DWFuncs.collector, 10000, (rivals));