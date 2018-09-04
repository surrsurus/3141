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
const Minimap = require('./minimap');
const Timer = require('./timer');

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

    // Create minimap
    this.minimap = new Minimap(environment);

    // Create timer
    this.timer = new Timer();

    // Save score
    this.score = 0;

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
    if (eh.keyEvents.background) this.bg.render(ctx);
    environment.render(ctx, this.camera);
    player.render(ctx, this.camera);
    this.minimap.render(ctx, environment);
    this.timer.render(ctx);
    
  }

  /**
   * @desc Update every object, namely the environment and player
   * @method
   * 
   * @param {Number} dt - Datetime
   */
  update(dt) {

    // New game
    if (eh.keyEvents.newGame) {
      eh.keyEvents.regenMap = true;
      this.score = 0;
    }

    // DEBUG: Regenerate the map
    if (eh.keyEvents.regenMap) {
      eh.keyEvents.regenMap = false;
      environment.genDungeon();
      [player.x, player.y] = environment.findStart();
      this.camera = new Camera(canvas, 0, 0);
      this.minimap = new Minimap(environment);
    }

    // Update all game objects
    if (eh.keyEvents.background) this.bg.update(dt);
    this.camera.update(ctx, player);
    this.minimap.update(dt);
    this.timer.update(dt);
    // environment.update(dt);
    player.update(environment);

    // Next map
    if (player.onStairs(environment)) {
      this.score += 1;
      eh.keyEvents.regenMap = true;
    }

    // Game end
    if (eh.state === 'timer end') {
      // Transfer ownership to a game screen
      let scoreScreen = new ScoreScreen(this.score);
      currentScreen = scoreScreen;
      currentScreen.update(dt);
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

    eh.state = 'paused';

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
      let gameScreen = new GameScreen();
      currentScreen = gameScreen;
      currentScreen.update(dt);

    }

  }

}

/**
 * @desc Display the score page
 * @class
 */
class ScoreScreen extends Screen {

  /**
   * @desc Initialize the title screen image
   * @constructor
   */
  constructor(score) {

    // Call Screen constructor
    super();

    this.score = score;

    eh.state = 'gameover';

    document.getElementById("canvas-wrapper").innerHTML = "\
    <div id=\"score-page\"> \
      <center>\
      <h2>Your Score: " + score + " </h2> \
        <p>Name: <input id=\"textbox\" type=\"text\"></p> \
        <button onclick=\"sendScore(" + score + ", document.getElementById('textbox').value)\">Submit & Quit</button> \
      </form> \
      </center> \
    </div>";

    // Delegates handling to html that then submits score and quits the game

  }

  /**
   * @desc Render the score screen image
   * @method
   */
  render() {
  }

  /**
   * @desc Check for event to transition
   * @method
   * 
   * @param {Number} dt - Datetime
   */
  update(dt) {

    // Check for new game event
    // if (eh.state !== 'gameover') {

    //   // Clear screen
    //   ctx.fillStyle = 'black';
    //   ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    //   ctx.save();

    //   // Valid since declaration happens before this gets a chance to run
    //   // If you have errors relating to TitleScreen.update(), this may be it.

    //   // Transfer ownership to a game screen
    //   let gameScreen = new GameScreen();
    //   currentScreen = gameScreen;
    //   currentScreen.update(dt);

    // }

  }

}

/**
 * Instantiate a game screen object to generate an environment so switching ownership to it
 * is faster
 */
// Can't do this here because of timer
// let gameScreen = new GameScreen();

/**
 * Establish the current screen object for this file.
 * Should be accessible by each Screen subclass since we should only be using them after
 * the declaration of this variable
 */
let currentScreen = undefined;
// if (S.debug) {
//   currentScreen = gameScreen;
// } else {
//   currentScreen = new TitleScreen();
// }

if (eh.state !== 'gameover') {
  currentScreen = new TitleScreen();
}


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

    if (eh.state === 'gameover') {
      return 0;
    }

    // Update animation
    requestAnimationFrame(tick);

  };

  // Start the game loop
  tick();

})();

