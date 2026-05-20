import Character from "./character.js";
import Platform from "./platform.js";

let canvasWidth = 400;
let canvasHeight = 600;

let scrollLine = 200;
let character1;
let platforms = [];
let movingPlatforms = [];
let breakablePlatforms = [];
let score = 0;
let state = "start";

class MovingPlatform extends Platform {
  constructor(x, y, w, h, speedX) {
    super(x, y, w, h);
    this.speedX = speedX;
  }
