import Character from "./character.js";
import Platform from "./platform.js";

let canvasWidth = 400;
let canvasHeight = 600;

let scrollLine = 200;  // y line — scroll when player goes above it
let character1;  // player object
let platforms = [];  // normal blue platforms
let movingPlatforms = [];  // green, move left/right
let breakablePlatforms = []; // red, break after one jump
let score = 0;
let state = "start";

// green platform that slides and bounces off walls
class MovingPlatform extends Platform {
  constructor(x, y, w, h, speedX) {
    super(x, y, w, h); // call parent constructor
    this.speedX = speedX;
  }

  update() {
    this.x += this.speedX;
    // flip direction at left or right edge
    if (this.x <= 0 || this.x + this.w >= width) {
      this.speedX *= -1;
    }
  }

  draw() {
    fill(60, 170, 70);
    noStroke();
    rect(this.x, this.y, this.w, this.h, 6);
    this.update(); // move while drawing
  }
}

// red platform — one use only
class BreakablePlatform extends Platform {
  constructor(x, y, w, h) {
    super(x, y, w, h);
    this.broken = false;
  }

  landsOn(character) {
    if (this.broken) return false;
    return super.landsOn(character); // use parent collision check
  }

  onLand() {
    this.broken = true; // mark broken when player lands
  }

  draw() {
    if (this.broken) return; // don't draw if broken
    fill(200, 70, 70);
    noStroke();
    rect(this.x, this.y, this.w, this.h, 6);
  }
}

// p5.js setup
function setup() {
  createCanvas(canvasWidth, canvasHeight);
  character1 = new Character(185, 450, 30, 30);
}

function draw() {
  background(250, 245, 230);

  if (state === "start") {
    showStartScreen();
    return;
  }

  if (state === "play") {
    runGame();
    return;
  }

  // state === "over"
  showGameOverScreen();
}
