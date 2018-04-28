/*jshint esversion: 6 */
class Entity 
{
  constructor(image, x, y, w, h, step = 2.3, radiusView = 8) {
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
    this.stop = true;
    Entity.count += 1;
    this.name = "ent" + Entity.count;
    this.goTo = -1;
    this.radiusView = radiusView;
    this.collecting = false;
    this.died = false;
  }
  draw(ctx, backZonePlayer) {
    ctx.beginPath();  
    if (!this.died) {
      if (this.stop) 
        ctx.drawImage(this.entityImg, 0, 100 * (this.dir == 1 ? 0 : 1), 80, 100, this.x - this.w / 2 - backZonePlayer, 
          this.y - this.h, 51, 64);
      else {
        let cadr = Math.floor((this.x) / 20);
        ctx.drawImage(this.entityImg, 80 * (cadr % 4), 100 * (this.dir == 1 ? 0 : 1), 80, 100, 
          this.x - this.w / 2 - backZonePlayer, this.y - this.h, 51, 64);
      }
    }
    else
      ctx.drawImage(this.entityImg, 0, 200, 80, 100, 
        this.x - this.w / 2 - backZonePlayer, this.y - this.h, 51, 64);
    ctx.stroke();
  }
  gravity(relief, ms) {
    let h = relief[Math.floor(this.x / 64)];
    if (this.y != h) {
      this.jumping = true;
      this.g += Math.floor(1 * ms / 25);
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
  
  jump() {
    this.y--;
    this.g = -11;
    this.jumping = true;
  }
}
Entity.count = -1;

class Player extends Entity
{
  setVars(point) {
    this.point = point;
    this.load = 0;
    this.backZone = 0;
    this.food = 10;
    delete this.goTo;
    delete this.radiusView;
  }
  draw(ctx) {
    ctx.beginPath();  
    if (this.stop)
      ctx.drawImage(this.entityImg, 0, 100 * (this.dir == 1 ? 0 : 1), 80, 100, this.x - this.w / 2, 
        this.y - this.h, 51, 64);
    else {
      let cadr = Math.floor((this.x + this.backZone) / 20);
      ctx.drawImage(this.entityImg, 80 * (cadr % 4), 100 * (this.dir == 1 ? 0 : 1), 80, 100,
       this.x - this.w / 2, this.y - this.h, 51, 64);
    }
    ctx.stroke();
    if (this.load != 0)
      this.drawColl(ctx);
  }
  woodCollection() {
    this.point += Math.round(Math.random() * 9 + 1);
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
  moving(relief, ms) {
    let dx = this.dir * Math.floor(this.step * (ms / 25));
    if (relief[Math.floor(((this.x + this.backZone) + this.dir * (this.step + 6))/ 64)] >= this.y)
      this.x += dx;
    //Left wool
    if (this.x < 0)
      this.x = 0;
    if (this.x > 320) {
      this.backZone += this.x - 320;
      this.x = 320;
    }
  }
  gravity(relief, ms) {
    let h = relief[Math.floor((this.x + this.backZone) / 64)];
    if (this.y != h) {
      this.jumping = true;
      this.g += Math.floor(1 * ms / 25);
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
}

class Rival extends Entity
{
  AI(obj, relief, dwood, ms) {
    if (this.goTo == -1) {
      if (!this.died) 
        this.searchDwood(dwood);
      if (this.goTo == -1 && !this.died) 
        this.dying(obj);
    }
    else {
      if (Math.abs(this.x - this.goTo) > 3) {
        this.stop = false;
        this.moving(relief, ms);
      }
      else if (!this.collecting && dwood.isWood(this.x)){
        this.stop = true;
        this.collecting = true;
        this.woodCollection(obj, dwood);
      }
      else 
        this.goTo = -1;
    }
  }
  searchDwood(dwood) {
    //console.log(this.name + " is looking f.w.");
    if (dwood.isWood(this.x))
      this.goTo = this.x;
    else {
      for (let i = 1; i <= this.radiusView; i++) {
        let leftView = -32 * i + this.x;
        let rightView = 32 * i + this.x;
        if (dwood.isWood(rightView)) {
          this.goTo = rightView;
          break;
        }
        if (dwood.isWood(leftView)) {
          this.goTo = leftView;
          break;
        }
      }
    }
    if (this.goTo < 8 || this.goTo > 6394)
      this.goTo = -1;
    if (this.goTo != -1)
      this.dir = this.x < this.goTo ? 1 : -1;
  }
  woodCollection(obj, dwood) {
    setTimeout(function(obj, dwood) {
      dwood.collection(obj.x);
      obj.collecting = false;
      obj.goTo = -1;
    }, 1000, obj, dwood);
  }
  moving(relief, ms) {
    let dx = this.dir * Math.floor(this.step * (ms / 25));
    if (relief[Math.floor((this.x + this.dir * (this.step + 6))/ 64)] >= this.y)
      this.x += dx;
    else if (!this.jumping) 
      this.jump();
    //Left wool
    if (this.x < 0)
      this.x = 0;
  }
  dying(obj) {
    console.log("--- " + obj.name);
    this.died = true;
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
    let blindZoneL = Math.floor(backZone / 32);
    let blindZoneR = blindZoneL + 21 < this.location.length ? blindZoneL + 21 : this.location.length;
    for (var i = blindZoneL; i < blindZoneR; i++)
      if (this.location[i] != 0) {
        ctx.beginPath();  
        ctx.drawImage(this.resImg, i * 32 - backZone, this.location[i]);
        ctx.stroke();
      }
  }
  collection(x) { 
    this.location[Math.floor(x / 32)] = 0;
  }
  isWood(x) {
    var area = Math.floor(x / 32);
    if (area < 0 || area > this.location.length)
      return false;
    else if (this.location[area] != 0)
      return true;
    else
      return false;
  }
}

class Background
{
  constructor() {
    this.woodImg = new Image();
    this.woodImg.src = '../img/front.png';
    this.back = new Image();
    this.back.src = '../img/back.png';
    this.position = 0;
  }
  draw(ctx, player) {
    ctx.beginPath();
    ctx.fillStyle = '#555555';
    ctx.fillRect(0, 0, 640, 400);
    if (this.position == 0 && player.x + player.backZone < 320) {
      //back
      ctx.drawImage(this.back, 0, 0, 640, 400);
      //front
      ctx.drawImage(this.woodImg, 0, 0, 640, 400);
    }
    else {
      let x = player.x + player.backZone;
      if (player.x == 320) {
        this.position = x;
        //back
        ctx.drawImage(this.back, (80 - x / 4 + 640 * Math.floor((x - 320) / 2560)), 0, 640, 400);
        ctx.drawImage(this.back, (720 - x / 4 + 640 * Math.floor((x - 320) / 2560)), 0, 640, 400);
        //front
        ctx.drawImage(this.woodImg, (160 - x / 2 + 640 * Math.floor((x - 320) / 1280)), 0, 640, 400);
        ctx.drawImage(this.woodImg, (800 - x / 2 + 640 * Math.floor((x - 320) / 1280)), 0, 640, 400);
      }
      else {
        //back
        ctx.drawImage(this.back, (80 - this.position / 4 +
         640 * Math.floor((this.position - 320) / 2560)), 0, 640, 400);
        ctx.drawImage(this.back, (720 - this.position / 4 +
         640 * Math.floor((this.position - 320) / 2560)), 0, 640, 400);
        //front
        ctx.drawImage(this.woodImg, (160 - this.position / 2 +
         640 * Math.floor((this.position - 320) / 1280)), 0, 640, 400);
        ctx.drawImage(this.woodImg, (800 - this.position / 2 +
         640 * Math.floor((this.position - 320) / 1280)), 0, 640, 400);
      }
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
    //+ camp location
    this.relief[50] = 336;
    this.relief[51] = 336;
    this.relief[52] = 336;
    this.relief[93] = 336;
    this.relief[94] = 336;
    this.relief[95] = 336;
    this.relief[96] = 336;
  }
  //Рисование рельефа
  draw(ctx, backZone) {
    let blindZoneL = Math.floor(backZone / 64);
    let blindZoneR = blindZoneL + 11 < this.relief.length ? blindZoneL + 11 : this.relief.length;
    for (var i = blindZoneL; i < blindZoneR; i++) {
      var rand = this.relief[i];
      ctx.beginPath();  
      ctx.drawImage(this.grassImg, i * 64 - backZone, rand);
      ctx.stroke();
    }
  }
}

class Shop
{
  constructor(image, x) {
    this.img = new Image();
    this.img.src = image;
    this.x = x;
    this.y = 144;
  }
  draw(ctx, backZone) {
    ctx.beginPath();  
    ctx.drawImage(this.img, this.x - backZone, this.y);
    ctx.stroke();
  }
}

class Interface
{
  constructor() {
  }
  draw(ctx, x, food, wood, buy, ms) {
    ctx.fillStyle = 'black';
    ctx.fillRect(5, 5, 630, 40);
    ctx.fillStyle = '#333333';
    ctx.fillRect(6, 6, 628, 38);

    let txt1 = 'Food:' + food;
    let txt2 = 'Wood:' + wood;
    let txt3 = 'Food cost:' + buy;

    ctx.font = '20pt sans-serif';
    ctx.fillStyle = '#eee'; 

    ctx.fillText(txt1, 15, 35);
    ctx.fillText(txt2, 320 - Math.floor(ctx.measureText(txt2).width / 2), 35);
    ctx.fillText(txt3, 625 - ctx.measureText(txt3).width, 35);
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
  constructor() {
    this.collectorWorking = false;
    this.playerLastPos = 16;
  }
  //Deadwood collection function
  static collManager(player, dwood) {
    let position = Math.floor(player.x / 32);
    if (dwood.isWood(player.x + player.backZone) && !player.jumping) {
      //Функция отображения сбора дерева
      player.collecting = true;
      let i = 0;
      let loading = setInterval(function() {
        i++;
        player.load = i;
      }, 50);
      //Функция сбора дерева
      setTimeout(function() {
        if (dwood.isWood(player.x + player.backZone) && position == Math.floor(player.x / 32) && !player.jumping) {
          player.woodCollection();
          dwood.collection(player.x + player.backZone);
        }
        clearInterval(loading);
        player.load = 0;
        player.collecting = false;
      }, 850);
      // +++ Добавить функцию прерывания всего при прыжке и т.д.
    }
  }
  //Управление персонажем
  static movingManager(player, ground, dwood, ms) {
    addEventListener("keydown", function(e) {
      if (player.stop) {
        if      (e.keyCode == 68)   { player.dir = 1;  player.stop = false; }
        else if (e.keyCode == 65)   { player.dir = -1; player.stop = false; }
      }
      else if   (e.keyCode == 16 && !player.jumping)    player.jump();
      if        (!player.collecting && e.keyCode == 83) DWFuncs.collManager(player, dwood);
    });
    addEventListener("keyup", function(e) {
      if (e.keyCode == 68 || e.keyCode == 65)
        player.stop = true;
    });
    if (!player.stop) {
      player.moving(ground.relief, ms);
    }
  }
  //Цикл по соперникам
  static rivalForeach(node, ctx, backZonePlayer, relief, dwood, ms) {
    function inside(node) {
      if (node != null) {
        node.data.AI(node.data, relief, dwood, ms);
        node.data.gravity(relief, ms);
        node.data.draw(ctx, backZonePlayer);
        if (node.next != null)
          inside(node.next);
      }
    }
    inside(node);
  }
  //Удаление умерших ботов
  static collector(...list) {
    //console.log("Collector is working");
    //this.collectorWorking = true;
    for (var i = 0; i < list.length; i++)
      list[i].removeAllByCond(b => b.data.died == true);
  }
  //Function adds new rival
  static newRival(list, player, location, mapLength) {
    let position = player.x + player.backZone + 600;
    if (position < mapLength * 64 && DWFuncs.checkRivalSpawn(location, Math.floor(position / 32))) {
      list.add(new Rival('../img/rival2.png', position, 300, 51, 64));
      console.log("add " + (list.last != null ? list.last.data.name : list.first.data.name) +
       " in " + position);
    }
  }
  //Function checks whether there are dwoods in the spawn rival place
  static checkRivalSpawn(location, chunk, visibility = 7) {
    let flag = false;
    let from = chunk - visibility;
    if (from < 0)
      from = 0;
    let to = chunk + visibility;
    if (to > location.length)
      to = location.length;
    for (from; from < to; from++) {
      if (location[from] != 0) {
        flag = true;
        break;
      }
    }
    return flag;
  }
  static diedWindow(ctx, ms) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 640, 400);

    let txt1 = 'YOU DIED';
    let txt2 = 'You have lived';
    let txt3 = ' ' + Math.floor(ms / 1000) + ' sec ';

    ctx.font = '20pt sans-serif';
    ctx.fillStyle = '#eee';
    ctx.fillText(txt1, 320 - Math.floor(ctx.measureText(txt1).width / 2), 190);
    ctx.fillText(txt2, 320 - Math.floor(ctx.measureText(txt2).width / 2), 220);
    ctx.fillText(txt3, 320 - Math.floor(ctx.measureText(txt3).width / 2), 250);
  }
}

//-----------------Notes-----------------

//rivals.removeAllByCond(x => x.data.name == "Enemy1" || x.data.name == "Enemy2")