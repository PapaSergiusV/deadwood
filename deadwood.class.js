/*jshint esversion: 6 */
class Entity 
{
	constructor(image, x, y, w, h, step) {
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
		this.backZone = 0;
	}
	draw(ctx) {
		ctx.beginPath();	
		ctx.drawImage(this.entityImg, this.x - this.w / 2, this.y - this.h, this.w, this.h);
		ctx.stroke();
	}
	gravity(relief, ms) {
		let h = relief[Math.floor((this.x + this.backZone) / 64)];
		if (this.y != h) {
			this.jumping = true;
			this.g++;
			let dy = Math.floor(this.g * ms / (25));
			if (this.y < h)
				this.y += dy;
			if (this.y > h) {
				this.y = h;
				this.g = 0;
			}
		}
		else
			this.jumping = false;
	}
	moving(direction, relief, ms) {
		let dx = direction * Math.floor(this.step * (ms / 25));
		let position = Math.floor(this.x / 32);
		if (relief[Math.floor((this.x + direction * (this.step + 6))/ 64)] >= this.y)
			this.x += dx;
		//Left wool
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
	setVars(point) {
		this.point = point;
		this.load = 0;
	}
	draw(ctx) {
		ctx.beginPath();	
		ctx.drawImage(this.entityImg, this.x - this.w / 2, this.y - this.h, this.w, this.h);
		ctx.stroke();
		if (this.load != 0)
			this.drawColl(ctx);
	}
	woodCollection() {
		this.point += Math.floor(Math.random() * 10);
	}
	drawColl(ctx) {
		let state = this.load;
		ctx.fillStyle = 'white';
		ctx.fillRect(this.x - 16, this.y - 74, 2 * state, 2);
		state = 16 - state;
		if (state != 0) {
			ctx.fillStyle = 'gray';
			ctx.fillRect(this.x + 16, this.y - 74, -2 * state, 2);
		}
	}
	moving(direction, relief, ms) {
		let dx = direction * Math.floor(this.step * (ms / 25));
		if (relief[Math.floor(((this.x + this.backZone) + direction * (this.step + 6))/ 64)] >= this.y)
			this.x += dx;
		//Left wool
		if (this.x < 0)
			this.x = 0;
		if (this.x > 320) {
			this.backZone += this.x - 320;
			this.x = 320;
		}
		//console.log(relief[Math.floor(this.x / 64)]);
		//console.log('moving');
	}
	request() {
		console.log('x=' + (this.x + this.backZone) + ' chank=' + Math.floor((this.x + this.backZone)/ 64));
	}
}

class Resources
{
	constructor(relief) {
		this.resImg = new Image();
		this.resImg.src = '../img/dwood.png';
		this.location = [];
		let length = relief.length * 2;
		for (var i = 0; i < length; i++) {
			if (Math.random() > 0.5)
				this.location[i] = relief[Math.floor(i / 2)] - 8;
			else
				this.location[i] = 0;
		}
	}
	draw(ctx, backZone) {
		for (var i = 0; i < this.location.length; i++)
			if (this.location[i] != 0) {
				ctx.beginPath();	
				ctx.drawImage(this.resImg, i * 32 - backZone, this.location[i]);
				ctx.stroke();
			}
	}
	collection(player) { 
		this.location[Math.floor((player.x + player.backZone) / 32)] = 0;
	}
	isWood(x) {
		var area = Math.floor(x / 32);
		if (this.location[area] != 0)
			return true;
		else
			return false;
	}
}

class Background
{
	constructor() {
		this.woodImg = new Image();
		this.woodImg.src = '../img/wood.jpg';
	}
	draw(ctx, x) {
		ctx.beginPath();
		if (x < 320)	
			ctx.drawImage(this.woodImg, 0, 0, 640, 400);
		else {
			ctx.drawImage(this.woodImg, (160 - x / 2 + 640 * Math.floor((x - 320) / 1280)), 0, 640, 400);
			ctx.drawImage(this.woodImg, (800 - x / 2 + 640 * Math.floor((x - 320) / 1280)), 0, 640, 400);
		}
		ctx.stroke();
	}
}

class Ground
{
	constructor(image, length) {
		this.relief = [];
		this.grassImg = new Image();
		this.grassImg.src = image;
		for (var i = 0; i < length; i++) {
			this.relief[i] = 400 - (Math.floor(Math.random() * (3 - 1)) + 1) * 32;
		}
	}
	//Рисование рельефа
	draw(ctx, backZone) {
		for (var i = 0; i < this.relief.length; i++) {	//	НУЖНО СДЕЛАТЬ ЧТОБЫ РИСОВАЛАСЬ ТОЛЬКО ЧАСТЬ РЕЛЬЕФА
			var rand = this.relief[i];
			ctx.beginPath();	
			ctx.drawImage(this.grassImg, i * 64 - backZone, rand);
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

class Fire 
{
	constructor(image, w, h) {
		this.w = w;
		this.h = h;
		this.image = new Image();
		this.image.src = image;
	}
	draw(ctx, x, y) {
		ctx.beginPath();	
		ctx.drawImage(this.image, x - this.w / 2, y - this.h / 2);
		ctx.stroke();
	}
}

class DWFuncs
{
	constructor() {}
	//Deadwood collection function
	static collManager(player, dwood) {
		let position = Math.floor(player.x / 32);
		if (dwood.isWood(player.x + player.backZone) && !player.jumping) {
			//Функция отображения сбора дерева
			let i = 0;
			let loading = setInterval(function() {
				i++;
				player.load = i;
			}, 50);
			//Функция сбора дерева
			setTimeout(function() {
				if (position == Math.floor(player.x / 32) && !player.jumping) {
					player.woodCollection();
					dwood.collection(player);
				}
				clearInterval(loading);
				player.load = 0;
			}, 850);
			// +++ Добавить функцию прерывания всего при прыжке и т.д.
		}
	}
}