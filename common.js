/*jshint esversion: 6 */
//Переменные common.js
let frame = 0;
let screen = document.getElementById('screen');
let ctx = screen.getContext('2d');
let time = new Date();
let ms = 20;
let mapLength = 100;

//Инициализация объектов классов
let wood = new Background();
let ground = new Ground('../img/grass.jpg', mapLength);
let player = new Player('../img/player.png', 16, 300, 32, 64, 2.3);
    player.setVars(0);
let dwood = new Resources(ground.relief);
let scores = new Interface(); 
let torch = new Fire('../img/fireInTheDark.png', 1280, 800);
 
//Вызовы главных функций 
addEventListener("keypress", keyListener); 
addEventListener("keydown", keyListener);
if (ctx) setInterval(render, 25);

//Функция отслеживания нажатия клавиш
function keyListener(e){
  var k = e.keyCode;
  if (k == 100 || k == 68)              player.moving(1, ground.relief, ms);
  else if (k == 97 || k == 65)          player.moving(-1, ground.relief, ms);
  else if (k == 16 && !player.jumping)  player.jump();
  else if (k == 115)                    DWFuncs.collManager(player, dwood);
}

//Главная функция игры
function render() {
  ms = new Date() - time;
  time = new Date();

  player.gravity(ground.relief, ms);

  wood.draw(ctx, player);
  ground.draw(ctx, player.backZone);
  dwood.draw(ctx, player.backZone);
  player.draw(ctx);
  torch.draw(ctx, player.x, player.y - 48);
  scores.draw(ctx, player.x + player.backZone, player.y, player.point, ms);  

  frame++; 
}