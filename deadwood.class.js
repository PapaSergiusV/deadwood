class Entity 
{
	constructor(image, x = 0, y = 0, w, h, step) {
		this.entityImg = new Image();
		this.entityImg.src = image;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.g = 0;
		this.jumping = false;
		this.step = step;
		this.dir = 1;
	}
	draw(ctx) {
		ctx.beginPath();	
		ctx.drawImage(this.entityImg, this.x - this.w / 2, this.y - this.h, this.w, this.h);
		ctx.stroke();
	}
	gravity(relief, ms) {
		let h = relief[Math.floor(this.x / 64)];
		if (this.y != h) {
			this.jumping = true;
			this.g++;
			let dy = Math.floor(this.g * ms / (25));
			if (this.y < h)
				this.y += dy
			if (this.y > h) {
				this.y = h;
				this.g = 0;
			}
		}
		else
			this.jumping = false;
	}
	moving(direction, relief, ms) {
		let dx = Math.floor(this.step * (ms / 25));
		if (direction == 1 && relief[Math.floor((this.x + this.step + 6)/ 64)] >= this.y) {
			this.x += dx;
			this.dir = 1;
		}
		else if (direction == -1 && relief[Math.floor((this.x - this.step - 6)/ 64)] >= this.y) {
			this.x -= dx;
			this.dir = -1;
		}
		if (this.x < 0)
			this.x = 0;
		//console.log(relief[Math.floor(this.x / 64)]);
		//console.log('moving');
	}
	jump() {
		this.y--;
		this.g = -13;
		this.jumping = true;
	}
}

class Player extends Entity
{
	setPoints(point) {
		this.point = point;
	}
	woodCollection(iswood) {
		if (iswood)
			this.point += Math.floor(Math.random() * 10);
	}
}

class Resources
{
	constructor(relief) {
		this.resImg = new Image();
		this.resImg.src = '../img/dwood.png';
		this.location = [];
		for (var i = 0; i < 20; i++) {
			if (Math.random() > 0.5)
				this.location[i] = relief[Math.floor(i / 2)] - 8;
			else
				this.location[i] = 0;
		}
	}
	draw(ctx) {
		for (var i = 0; i < this.location.length; i++)
			if (this.location[i] != 0) {
				ctx.beginPath();	
				ctx.drawImage(this.resImg, i * 32, this.location[i]);
				ctx.stroke();
			}
	}
	isWood(x) {
		var area = Math.floor(x / 32);
		if (this.location[area] != 0) {
			this.location[area] = 0;
			return true;
		}
		else
			return false;
	}
}

class Wood
{
	constructor() {
		this.woodImg = new Image();
		this.woodImg.src = '../img/wood.jpg';
	}
	draw(ctx) {
		ctx.beginPath();	
		ctx.drawImage(this.woodImg, 0, 0, 640, 400);
		ctx.stroke();
	}
}

class Ground
{
	constructor(image) {
		this.relief = [];
		this.grassImg = new Image();
		this.grassImg.src = image;
		for (var i = 0; i < 10; i++) {
			this.relief[i] = 400 - (Math.floor(Math.random() * (3 - 1)) + 1) * 32;
		}
	}
	//Рисование рельефа
	draw(ctx) {
		for (var i = 0; i < 10; i++) {
			var rand = this.relief[i];
			ctx.beginPath();	
			ctx.drawImage(this.grassImg, i * 64, rand);
			ctx.stroke();
		}
	}
}

class Interface
{
	constructor() {

	}
	draw(ctx, x, y, point, ms) {
		ctx.fillStyle = '#333333';
		ctx.strokeStyle = '#000';
		ctx.fillRect(10, 10, 620, 40);
		ctx.font = '20pt Roboto';
		ctx.fillStyle = '#eee';
		ctx.fillText('X:' + x + '   Y:' + y + '   Score:' + point + '   FPS:' + Math.floor(1000 / ms), 15, 35);
	}
}