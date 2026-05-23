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

// Main game loop while playing
function runGame() {
  // set horizontal speed from keyboard (arrows or A/D)
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) character1.vx = -5;
  else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) character1.vx = 5;
  else character1.vx = 0;

  // apply gravity and update position (in Character.move)
  character1.move();

  // check each platform array, jump if landing on one
  let hitPlatform = character1.collides(platforms);
  if (hitPlatform) character1.jump();

  let hitMoving = character1.collides(movingPlatforms);
  if (hitMoving) character1.jump();

  let hitBreakable = character1.collides(breakablePlatforms);
  if (hitBreakable) {
    character1.jump();
    hitBreakable.onLand(); // break the red platform
  }

  // draw every platform in each array (uses for loops)
  for (let i = 0; i < platforms.length; i++) {
    platforms[i].draw();
  }
  for (let i = 0; i < movingPlatforms.length; i++) {
    movingPlatforms[i].draw();
  }
  for (let i = 0; i < breakablePlatforms.length; i++) {
    breakablePlatforms[i].draw();
  }

  character1.draw();

  // camera scroll, player stays near scrollLine, world moves down
  if (character1.y < scrollLine) {
    let diff = scrollLine - character1.y;
    character1.y = scrollLine;
    score += floor(diff); // higher climb = more points

    // push all platforms down by the same amount
    for (let i = 0; i < platforms.length; i++) {
      platforms[i].y += diff;
    }
    for (let i = 0; i < movingPlatforms.length; i++) {
      movingPlatforms[i].y += diff;
    }
    for (let i = 0; i < breakablePlatforms.length; i++) {
      breakablePlatforms[i].y += diff;
    }
  }

  respawnIfOffScreen();

  // show score on screen
  fill(0);
  textSize(20);
  textAlign(LEFT, TOP);
  text("Score: " + score, 10, 25);

  // fell off bottom of screen
  if (character1.y > canvasHeight) {
    state = "over";
  }
}

// recycle platforms that scrolled below the screen
function respawnIfOffScreen() {
  for (let i = 0; i < platforms.length; i++) {
    if (platforms[i].y > height + 40) {
      platforms[i].y = -20; // place above visible area
      platforms[i].x = random(0, width - platforms[i].w);
    }
  }

  for (let i = 0; i < movingPlatforms.length; i++) {
    if (movingPlatforms[i].y > height + 40) {
      movingPlatforms[i].y = -20;
      movingPlatforms[i].x = random(0, width - movingPlatforms[i].w);
    }
  }

  for (let i = 0; i < breakablePlatforms.length; i++) {
    if (breakablePlatforms[i].y > height + 40) {
      breakablePlatforms[i].y = -20;
      breakablePlatforms[i].x = random(0, width - breakablePlatforms[i].w);
      breakablePlatforms[i].broken = false; // can be stepped on again
    }
  }
}

// set up a new game, clear arrays and spawn platforms
function resetGame() {
  score = 0;
  character1 = new Character(185, 450, 30, 30);
  character1.jump(); // small bounce at start

  platforms = [];
  movingPlatforms = [];
  breakablePlatforms = [];

  // starting platform under the player
  platforms.push(new Platform(165, 500, 70, 12));

  // loop creates 8 normal platforms going upward
  for (let i = 0; i < 8; i++) {
    platforms.push(
      new Platform(random(width - 80), 450 - i * 80, 70, 12)
    );
  }

  // two moving platforms at different heights
  movingPlatforms.push(
    new MovingPlatform(random(width - 80), 300, 70, 12, 2)
  );
  movingPlatforms.push(
    new MovingPlatform(random(width - 80), 180, 70, 12, -2)
  );

  // two breakable platforms
  breakablePlatforms.push(
    new BreakablePlatform(random(width - 80), 240, 70, 12)
  );
  breakablePlatforms.push(
    new BreakablePlatform(random(width - 80), 120, 70, 12)
  );
}

// title screen before game starts
function showStartScreen() {
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("Doodle Jump", width / 2, height / 2 - 40);
  textSize(16);
  text("Arrow keys or A/D to move", width / 2, height / 2 + 10);
  text("Click or SPACE to start", width / 2, height / 2 + 50);
}

// game over
function showGameOverScreen() {
  for (let i = 0; i < platforms.length; i++) platforms[i].draw();
  for (let i = 0; i < movingPlatforms.length; i++) movingPlatforms[i].draw();
  for (let i = 0; i < breakablePlatforms.length; i++) breakablePlatforms[i].draw();
  character1.draw();

  fill(0, 150); // semi-transparent overlay
  noStroke();
  rect(0, 0, width, height);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(30);
  text("Game Over", width / 2, height / 2 - 30);
  textSize(18);
  text("Score: " + score, width / 2, height / 2 + 10);
  text("Click or SPACE to restart", width / 2, height / 2 + 50);
}

function startGame() {
  state = "play";
  resetGame();
}
