let frame = 0;
let screen = document.getElementById('screen');
let ctx = screen.getContext('2d');

//Инициализация объектов класса
let wood = new Wood();
let ground = new Ground('../img/grass.jpg');
let player = new Player('../img/player.png', 16, 300, 32, 64);
let scores = new Interface(); 

function render() {
	player.gravity(ground.relief); 

	wood.draw(ctx);
	ground.draw(ctx);
	player.draw(ctx);
	scores.draw(ctx, player.x, player.y); 
	frame++;
	//console.log(frame);
}

if (ctx) setInterval(render, 20);

function keyListener(e){
    var k = e.keyCode;
    if (k == 100 || k == 68)				player.moving('r', ground.relief);
    else if (k == 97 || k == 65)			player.moving('l', ground.relief); 
    else if (k == 87 && !player.jumping)	player.jump(); 
}

addEventListener("keypress", keyListener);
addEventListener("keydown", keyListener);
addEventListener("keyup", keyListener);