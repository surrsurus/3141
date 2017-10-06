/**
 * Include this file to start the game
 */

const player = require('./player');
const environment = require('./environment');
const keyboard = require('./keyboard');

const S = require('./settings');
const Camera = require('./camera');

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

/**
 * @desc Game class handles rendering everything and updating all elements each tick, 
 * though does not do this in a loop on its own
 * @class
 */
class Game {

  /**
   * @desc Initialize the canvas, player positon, and camera
   * @constructor
   */
  constructor() {

    ctx.imageSmoothingEnabled = false;

    // Initialize the canvas
    canvas.width = S.canvasWidth;
    canvas.height = S.canvasHeight;
    canvas.style.width = canvas.width * S.canvasMagnification + 'px';
    canvas.style.height = canvas.height * S.canvasMagnification + 'px';

    // Place the player
    [player.x, player.y] = environment.findStart();

    // Initialize the camera
    this.camera = new Camera(canvas, 0, 0);

  }

  /**
   * @desc Render all the objects to the canvas
   * @function
   */
  render() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    environment.render(ctx, this.camera);
    player.render(ctx, this.camera);
    
    environment.renderForeground(ctx, this.camera);
    
  }

  /**
   * @desc Update every object
   * @function
   * 
   * @param {Number} dt Datetime
   */
  update(dt) {

    environment.update(dt);
    this.camera.update(ctx, player);
    player.update(environment);

  }

}

/**
 * Main game loop
 */

// Create game object
const game = new Game();

// Save last time
let lastTime;

/**
 * @desc Main function that makes the game object render and update in a loop
 * @main
 */
const main = () => {

  let now = Date.now();
  let dt = (now - lastTime) / 1000.0;

  game.update(dt);
  game.render();

  lastTime = now;
  requestAnimationFrame(main);

};

main();
