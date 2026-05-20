export default class Platform {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  draw() {
    fill(70, 130, 220);
    noStroke();
    rect(this.x, this.y, this.w, this.h, 6);
  }
