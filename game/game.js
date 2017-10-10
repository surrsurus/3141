/**
 * This is the file that contains all Screen objects used by the game to handle game flow as well as a
 * self executing main function that runs as soon as the file is included in an html file
 */

 // Game objects
const player = require('./player');
const environment = require('./environment');
const keyboard = require('./keyboard');
const eh = require('./eventHandler');

// Objects/Classes
const S = require('./settings');
const Camera = require('./camera');
const Background = require('./background');

// Canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

/**
 * @desc Superclass for screens
 * 
 * Idea behind screens
 * 
 * By having a set "current screen" (and assuming a screen can be updated and rendered) we can choose what to render
 * and update, and allow for switching between a pause, title, and game screen for examples easily
 * 
 * @abstract
 */
class Screen {

  /**
   * @desc Constructor for superclass
   * 
   * We make the assumption that any necessary canvas initialization or management happens elsewhere, for example
   * onload or at the start of a main function
   * 
   * @constructor
   */
  constructor() {}

  /**
   * @desc Render objects held by the screen
   * @method
   */
  render() { throw Exception('Screen is an abstract class, override this method'); }

  /**
   * @desc Update objects held by the screen every tick
   * @method
   * 
   * @param {Number} dt Datetime
   */
  update(dt) { throw Exception('Screen is an abstract class, override this method'); }

}

/**
 * @desc Game Screen handles the updating and rendering of game objects
 * @class
 */
class GameScreen extends Screen {

  /**
   * @desc Initialize the player positon, and camera.
   * @constructor
   */
  constructor() {

    // Call Screen constructor
    super();

    // Place the player
    [player.x, player.y] = environment.findStart();

    // Initialize the camera
    this.camera = new Camera(canvas, ctx, 0, 0);

    // Initialize the background
    this.bg = new Background(ctx);

  }

  /**
   * @desc Render all the game objects to the canvas
   * namely the environment and player
   * @method
   */
  render() {
    
    // Clear the screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Render the background, the player, then the foreground
    this.bg.render(ctx);
    environment.render(ctx, this.camera);
    player.render(ctx, this.camera);
    
  }

  /**
   * @desc Update every object, namely the environment and player
   * @method
   * 
   * @param {Number} dt - Datetime
   */
  update(dt) {

    // DEBUG: Regenerate the map
    if (eh.keyEvents.regenMap) {
      eh.keyEvents.regenMap = false;
      environment.genDungeon();
      [player.x, player.y] = environment.findStart();
      this.camera = new Camera(canvas, 0, 0);
    }

    // Update all game objects
    this.bg.update(dt);
    this.camera.update(ctx, player);
    // environment.update(dt);
    player.update(environment);

    if (player.onStairs(environment)) {
      eh.keyEvents.regenMap = true;
    }

  }

}

/**
 * @desc Display a static image as the tile screen and go to the game screen on a button press
 * @class
 */
class TitleScreen extends Screen {

  /**
   * @desc Initialize the title screen image
   * @constructor
   */
  constructor() {

    // Call Screen constructor
    super();

    // Create an image object
    this.title = new Image();
    this.title.src = "./assets/ui/title.png";

  }

  /**
   * @desc Render the title screen image
   * @method
   */
  render() {
    ctx.drawImage(this.title, 0, 0);
  }

  /**
   * @desc Check for event to transition to game screen
   * @method
   * 
   * @param {Number} dt - Datetime
   */
  update(dt) {

    // Check for unpause event
    if (eh.state !== 'paused') {

      // Clear screen
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.save();

      // Valid since declaration happens before this gets a chance to run
      // If you have errors relating to TitleScreen.update(), this may be it.

      // Transfer ownership to a game screen
      currentScreen = gameScreen;
      currentScreen.update(dt);

    }

  }

}

/**
 * Establish the current screen object for this file.
 * Should be accessible by each Screen subclass since we should only be using them after
 * the declaration of this variable
 */
let currentScreen = new TitleScreen();

/**
 * Instantiate a game screen object to generate an environment so switching ownership to it
 * is faster
 */
let gameScreen = new GameScreen();

/**
  * @desc Main function that auto-executes and makes the game object render and update animations in a loop
  * @main
  */
const main = ( () => {

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

  /**
   * @desc This function represents a tick with respect to the game. 
   * Every tick, the game state is updated, objects are rendered, and animations are played
   * @function
   */
  const tick = () => {

    // Get time 
    let now = Date.now();
    let dt = (now - lastTime) / 1000.0;

    currentScreen.update(dt);
    currentScreen.render();

    lastTime = now;

    // Update animation
    requestAnimationFrame(tick);

  };

  // Start the game loop
  tick();

})();

