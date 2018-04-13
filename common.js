let frame = 0;
let screen = document.getElementById('screen');
let ctx = screen.getContext('2d');
let time = new Date();
let ms = 20;

//Инициализация объектов класса
let wood = new Wood();
let ground = new Ground('../img/grass.jpg');
let player = new Player('../img/player.png', 16, 300, 32, 64, 2.3);
	player.setPoints(0);
let dwood = new Resources(ground.relief);
let scores = new Interface(); 


if (ctx) setInterval(render, 25);

addEventListener("keypress", keyListener);
addEventListener("keydown", keyListener);

function keyListener(e){ 
    var k = e.keyCode;
    if (k == 100 || k == 68)				player.moving(1, ground.relief, ms);
    else if (k == 97 || k == 65)			player.moving(-1, ground.relief, ms);
    else if (k == 16 && !player.jumping)	player.jump();
    else if (k == 115)						player.woodCollection(dwood.isWood(player.x));
}

function render() {
	ms = new Date() - time;
	time = new Date();
	player.gravity(ground.relief, ms);
	wood.draw(ctx);
	ground.draw(ctx);
	dwood.draw(ctx);
	player.draw(ctx);
	scores.draw(ctx, player.x, player.y, player.point, ms); 
	frame++; 
	//console.log(frame); 
}