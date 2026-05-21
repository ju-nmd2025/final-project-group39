// platform
export default class Platform {
  // x, y = top-left corner; w, h = width and height
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  // draw blue rounded rectangle at platform position
  draw() {
    fill(70, 130, 220);
    noStroke();
    rect(this.x, this.y, this.w, this.h, 6);
  }

 // returns true if character landed on top of this platform
 landsOn(character) {
    return (
      character.vy > 0 && // falling down, not jumping up through
      character.y + character.h > this.y && // feet at or below platform top
      character.y + character.h < this.y + this.h + 5 && // feet near top (+5 tolerance)
      character.x + character.w > this.x && // horizontal overlap — left side
      character.x < this.x + this.w  // horizontal overlap — right side
    );
  }
}
