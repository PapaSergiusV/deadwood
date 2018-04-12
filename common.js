//$(function() {
//});
var frame = 0;
var screen = document.getElementById('screen');
var ctx = screen.getContext('2d');

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

function main() {
	wood.draw('../img/wood.jpg');
	ground.drawRelief();
	frame++;
}

if (ctx) setInterval(main, 1000);