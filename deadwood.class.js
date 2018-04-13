class Entity 
{
	constructor(image, x = 0, y = 0, w, h) {
		this.entityImg = new Image();
		this.entityImg.src = image;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.g = 0;
		this.jumping = false;
	}
	draw(ctx) {
		ctx.beginPath();	
		ctx.drawImage(this.entityImg, this.x - this.w / 2, this.y - this.h, this.w, this.h);
		ctx.stroke();
	}
	gravity(relief) {
		let h = relief[Math.floor(this.x / 64)];
		if (this.y != h) {
			this.g++;
			if (this.y < h)
				this.y += this.g;
			else if (this.y > h) {
				this.y = h;
				this.g = 0;
				this.jumping = false;
			}
		}
	}
	moving(direction, relief) {
		if (direction == 'r' && (relief[Math.floor((this.x + 2)/ 64)] >= this.y || this.jumping))
			this.x += 2;
		else if (direction == 'l' && (relief[Math.floor((this.x - 2)/ 64)] >= this.y || this.jumping))
			this.x -= 2;
		if (this.x < 0)
			this.x = 0;
		//console.log(relief[Math.floor(this.x / 64)]);
		//console.log('moving');
	}
	jump() {
		this.y--;
		this.g = -12;
		this.jumping = true;
	}
}

class Player extends Entity
{
	
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
	draw(ctx, x, y) {
		ctx.fillStyle = '#333333';
		ctx.strokeStyle = '#000';
		ctx.fillRect(10, 10, 620, 40);
		ctx.font = '20pt Roboto';
		ctx.fillStyle = '#eee';
		ctx.fillText('X:' + x + ' Y:' + y, 15, 35);
	}
}