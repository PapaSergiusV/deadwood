//$(function() {
//});
var frame = 0;
var screen = document.getElementById('screen');
var ctx = screen.getContext('2d');

var entity = {
	entityImg: new Image(),
	x: 0,
	y: 0,
	h: 0,
	w: 0,
	init: function(image, x, y, w, h) {
		this.entityImg.src = image;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	},
	draw: function() {
		ctx.beginPath();	
		ctx.drawImage(this.entityImg, this.x, this.y - this.h, this.w, this.h);
		ctx.stroke();
	}
}

var player = {
	moving: function(direction) {
		if (direction == 'r')
			this.x += 5;
		else if (direction == 'l')
			this.x -= 5;
	}
}
player.__proto__ = entity;

var wood = {
	woodImg: new Image(),
	draw: function(image) {
		this.woodImg.src = image;
		ctx.beginPath();	
		ctx.drawImage(this.woodImg, 0, 0, 640, 400);
		ctx.stroke();
	}
}

var ground = {
	relief: [],
	grassImg: new Image(),
	//Инициализация изображения травы
	initGrass: function(image) {
		this.grassImg.src = image;
	},
	//Инициализация рельефа (10 блоков)
	initRelief: function() {
		for (var i = 0; i < 10; i++) {
			var rand = Math.floor(Math.random() * (3 - 1)) + 1;
			this.relief[i] = rand;
		}
	},
	//Рисование рельефа
	drawRelief: function() {
		for (var i = 0; i < 10; i++) {
			var rand = this.relief[i];
			ctx.beginPath();	
			ctx.drawImage(this.grassImg, i * 64, 400 - 32 * rand);
			ctx.stroke();
		}
	}
}

ground.initGrass('../img/grass.jpg');
ground.initRelief();
player.init('../img/player.png', 0, 336, 32, 64);

function main() {
	wood.draw('../img/wood.jpg');
	ground.drawRelief();
	player.draw();
	frame++;
}

if (ctx) setInterval(main, 10);

function moveRect(e){
    switch(e.keyCode){
        
        case 37:  // если нажата клавиша влево
            player.moving('l');
            break;
        case 38:   // если нажата клавиша вверх
            break;
        case 39:   // если нажата клавиша вправо
            player.moving('r');
            break;
        case 40:   // если нажата клавиша вниз
            break;
    }
}
 
addEventListener("keydown", moveRect);