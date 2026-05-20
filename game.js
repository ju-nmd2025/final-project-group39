// Store the main player object and all platforms
let player;
let platforms = [];

// The Character class controls the player's position, movement, and jumping
class Character {
  constructor(x, y) {
    // x and y are the top-left position of the player
    this.x = x;
    this.y = y;
    this.w = 35;
    this.h = 45;

    // Speed values change every frame in update()
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.gravity = 0.35;
    this.jumpPower = -9;
  }

  update() {
    // Reset horizontal movement first, then check which key is pressed
    this.xSpeed = 0;

    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      this.xSpeed = -4;
    }

    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      this.xSpeed = 4;
    }

    // Gravity pulls the player down, then speed changes the position
    this.ySpeed += this.gravity;
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    // Keep the player inside the canvas for this first draft
    this.x = constrain(this.x, 0, width - this.w);
  }

  jump() {
    // A negative y speed moves the player upward
    this.ySpeed = this.jumpPower;
  }

  touches(platform) {
    // The player should only jump when landing on top of a platform
    const isFalling = this.ySpeed > 0;
    const feet = this.y + this.h;
    const wasAbove = feet - this.ySpeed <= platform.y;
    const hitsTop = feet >= platform.y;
    const hitsLeft = this.x + this.w > platform.x;
    const hitsRight = this.x < platform.x + platform.w;

    return isFalling && wasAbove && hitsTop && hitsLeft && hitsRight;
  }

  draw() {
    // Draw a simple rectangle character with two eyes
    fill(90, 180, 120);
    stroke(40);
    rect(this.x, this.y, this.w, this.h, 8);

    fill(20);
    circle(this.x + 10, this.y + 15, 5);
    circle(this.x + 25, this.y + 15, 5);
  }
}

// The Platform class stores and draws one platform
class Platform {
  constructor(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = 12;
  }

  draw() {
    fill(80, 150, 255);
    stroke(40);
    rect(this.x, this.y, this.w, this.h, 8);
  }
}

function setup() {
  // setup() runs once at the start of the game
  createCanvas(400, 600);
  player = new Character(180, 480);

  // This array stores all platforms in the level
  platforms = [
    new Platform(150, 540, 100),
    new Platform(50, 430, 100),
    new Platform(230, 330, 100),
    new Platform(100, 230, 100),
  ];
}

function draw() {
  // draw() runs again and again to animate the game
  background(235, 245, 255);
  drawBackground();

  player.update();

  // Loop through the platform array to draw platforms and check collisions
  for (let i = 0; i < platforms.length; i++) {
    platforms[i].draw();

    if (player.touches(platforms[i])) {
      player.jump();
    }
  }

  player.draw();
  drawInstructions();
}

function drawBackground() {
  // Draw a simple grid background
  stroke(215, 230, 245);

  for (let x = 0; x < width; x += 25) {
    line(x, 0, x, height);
  }

  for (let y = 0; y < height; y += 25) {
    line(0, y, width, y);
  }
}

function drawInstructions() {
  // Show controls on the canvas
  noStroke();
  fill(30);
  textSize(16);
  textAlign(LEFT, TOP);
  text("Use A/D or arrow keys to move", 15, 15);
}
