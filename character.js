export default class Character {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.vx = 0;
    this.vy = 0;
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
  }

  move() {
    this.vy += 0.4;
    this.x += this.vx;
    this.y += this.vy;
    this.x = constrain(this.x, 0, width - this.w);
  }

  jump() {
    this.vy = -12;
  }

  draw() {
    fill(100, 200, 80);
    noStroke();
    ellipse(this.x + this.w / 2, this.y + this.h / 2, this.w, this.h);
  }
