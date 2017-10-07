/**
 * This is the file that contains the Game object that controls all entities the game needs to function
 * The game will automatically call its main function as soon as this file is added via a script tag in an html file
 */

 // Game objects
const player = require('./player');
const environment = require('./environment');
const keyboard = require('./keyboard');

// Objects/Classes
const S = require('./settings');
const Camera = require('./camera');

// Canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

/**
 * @desc Game class handles rendering everything and updating all elements each tick, 
 * though does not do this in a loop on its own
 * @class
 */
class Game {

  /**
   * @desc Initialize the canvas, player positon, and camera.
   * Assumes canvas is already initialized
   * @constructor
   */
  constructor() {

    // Place the player
    [player.x, player.y] = environment.findStart();

    // Initialize the camera
    this.camera = new Camera(canvas, 0, 0);
    this.camera.update(ctx, player);

  }

  /**
   * @desc Render all the objects to the canvas
   * @function
   */
  render() {
    
    // Clear the screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Render the background, the player, then the foreground
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

    // DEBUG: Regenerate the map
    if (global.regen) {
      global.regen = false;
      environment.genDungeon();
      [player.x, player.y] = environment.findStart();
      this.camera = new Camera(canvas, 0, 0);
    }

    // Update all game objects
    environment.update(dt);
    this.camera.update(ctx, player);
    player.update(environment);

  }

}

class TitleScreen {
  constructor() {
    this.title = new Image();
    this.title.src = "./assets/ui/title.png";
  }

  render() {
    ctx.drawImage(this.title, 0, 0);
  }

  update() {
    if (global.startGame) {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.save();
      global.currScreen = new Game();
    }
  }

}

 /**
   * @desc Main function that makes the game object render and update animations in a loop
   * @main
   */
const main = (function(){

  /**
   * Initialize canvas
   */
  // Get that pixelated look
  ctx.imageSmoothingEnabled = false;
  
  // Initialize the canvas
  canvas.width = S.canvasWidth;
  canvas.height = S.canvasHeight;
  canvas.style.width = canvas.width * S.canvasMagnification + 'px';
  canvas.style.height = canvas.height * S.canvasMagnification + 'px';

  // Save last time
  let lastTime;

  // Title screen
  global.currScreen = new TitleScreen();

  /**
   * @desc This function represents a tick with respect to the game. 
   * Every tick, the game state is updated, objects are rendered, and animations are played
   * @function
   */
  const tick = () => {

    // Get time 
    let now = Date.now();
    let dt = (now - lastTime) / 1000.0;

    global.currScreen.update(dt);
    global.currScreen.render();

    lastTime = now;

    // Update animation
    requestAnimationFrame(tick);

  };

  // Start the game loop
  tick();

})();

