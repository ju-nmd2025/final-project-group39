export default class Character {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.vx = 0; // horizontal speed
    this.vy = 0; // vertical speed
  }

  // reset player position and velocity for a new game
  reset(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
  }

  // apply gravity, move player, and keep inside left/right bounds
  move() {
    this.vy += 0.4;
    this.x += this.vx; // horizontal movement
    this.y += this.vy; // vertical movement
    this.x = constrain(this.x, 0, width - this.w);  // clamp to canvas width
  }

  // jump by giving an upward velocity
  jump() {
    this.vy = -12;
  }

  // draw the player as a green circle
  draw() {
    fill(100, 200, 80);
    noStroke();
    ellipse(this.x + this.w / 2, this.y + this.h / 2, this.w, this.h);
  }

  // Check collision with a list of platforms
  collides(platformList) {
    for (let i = 0; i < platformList.length; i++) {
      if (platformList[i].landsOn(this)) {
        return platformList[i];
      }
    }
    // no collision this frame
    return null;
  }
}
