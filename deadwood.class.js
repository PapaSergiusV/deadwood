/*jshint esversion: 6 */
class Entity 
{
  constructor(image, x, y, w, h, step = 2, radiusView = 5) {
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
    ctx.drawImage(this.entityImg, this.x - this.w / 2 - backZonePlayer, this.y - this.h, this.w, this.h);
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
Entity.count = 0;

class Player extends Entity
{
  setVars(point) {
    this.point = point;
    this.load = 0;
    this.backZone = 0;
    delete this.goTo;
    delete this.radiusView;
  }
  draw(ctx) {
    ctx.beginPath();  
    ctx.drawImage(this.entityImg, this.x - this.w / 2, this.y - this.h, this.w, this.h);
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
      if (Math.abs(this.x - this.goTo) > 3)
        this.moving(relief, ms);
      else if (!this.collecting){
        this.collecting = true;
        this.woodCollection(obj, dwood);
      }
    }
  }
  searchDwood(dwood) {
    console.log(this.name + " is looking f.w.");
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
    if (this.goTo < -1)
      this.goTo = -1;
    if (this.goTo != -1)
      this.dir = this.x < this.goTo ? 1 : -1;
  }
  woodCollection(obj, dwood) {
    setTimeout(function(obj, dwood) {
      dwood.collection(obj.x);
      obj.collecting = false;
      obj.goTo = -1;
    }, 2000, obj, dwood);
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
    console.log(obj.name + " is dying");
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
    this.position = 0;
  }
  draw(ctx, player) {
    ctx.beginPath();
    if (this.position == 0 && player.x + player.backZone < 320) 
      ctx.drawImage(this.woodImg, 0, 0, 640, 400);
    else {
      let x = player.x + player.backZone;
      if (player.x == 320) {
        this.position = x;
        ctx.drawImage(this.woodImg, (160 - x / 2 + 640 * Math.floor((x - 320) / 1280)), 0, 640, 400);
        ctx.drawImage(this.woodImg, (800 - x / 2 + 640 * Math.floor((x - 320) / 1280)), 0, 640, 400);
      }
      else {
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
  constructor() {
    this.collectorWorking = false;
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
        if (position == Math.floor(player.x / 32) && !player.jumping) {
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
        //if (!node.data.collection)
        //  node.data.moving(relief, ms);
        /*if (dwood.isWood(node.data.x)) {
          node.data.collection = true;
          setTimeout(function() {
            dwood.collection(node.data.x);
            node.data.collection = false;
          }, 1000);
        }*/
        node.data.AI(node.data, relief, dwood, ms);
        //console.log(node.data.goTo);
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
    this.collectorWorking = true;
    for (var i = 0; i < list.length; i++)
      list[i].removeAllByCond(b => b.data.died == true);
  }
}

//Notes

//rivals.removeAllByCond(x => x.data.name == "Enemy1" || x.data.name == "Enemy2")