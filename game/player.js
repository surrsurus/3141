const S = require('./settings');
const eh = require('./eventHandler');

/**
 * @desc Player class manages the player and their input, the character sprite/model, and hitbox
 * @class
 */
class Player {

  /**
   * @desc Constructor for player. Most important part is that it sets up the frames for animation
   * @constructor
   */
  constructor() {
    this.loaded = false;
    this.speed = 2;
    this.sprint = 1;
    this.imgMoving = S.playerImageMoving;
    this.imgIdle = S.playerImageIdle;
    this.width = 32;
    this.height = 32;
    this.frame = 0;
    this.tickCount = 0;
    this.x = 12;
    this.y = 65;
    this.idleDirection = 'down';
    this.direction = [];
    this.moving = false;
    this.frames = {
      up: [
        { x: 0, y: 0 },
        { x: 32, y: 0 },
        { x: 64, y: 0 },
        { x: 96, y: 0 },
        { x: 128, y: 0 },
        { x: 160, y: 0 },
        { x: 192, y: 0 },
        { x: 224, y: 0 },
        { x: 256, y: 0 },
        { x: 288, y: 0 },
        { x: 320, y: 0 },
        { x: 352, y: 0 },
      ],
      down: [
        { x: 0, y: 32 },
        { x: 32, y: 32 },
        { x: 64, y: 32 },
        { x: 96, y: 32 },
        { x: 128, y: 32 },
        { x: 160, y: 32 },
        { x: 192, y: 32 },
        { x: 224, y: 32 },
        { x: 256, y: 32 },
        { x: 288, y: 32 },
        { x: 320, y: 32 },
        { x: 352, y: 32 },
      ],
      left: [
        { x: 0, y: 64 },
        { x: 32, y: 64 },
        { x: 64, y: 64 },
        { x: 96, y: 64 },
        { x: 128, y: 64 },
        { x: 160, y: 64 },
        { x: 192, y: 64 },
        { x: 224, y: 64 },
        { x: 256, y: 64 },
        { x: 288, y: 64 },
        { x: 320, y: 64 },
        { x: 352, y: 64 },
      ],
      right: [
        { x: 0, y: 96 },
        { x: 32, y: 96 },
        { x: 64, y: 96 },
        { x: 96, y: 96 },
        { x: 128, y: 96 },
        { x: 160, y: 96 },
        { x: 192, y: 96 },
        { x: 224, y: 96 },
        { x: 256, y: 96 },
        { x: 288, y: 96 },
        { x: 320, y: 96 },
        { x: 352, y: 96 },
      ],
    };
    this.idleFrames = {
      up: { x: 0, y: 0 },
      down: { x: 0, y: 32 },
      left: { x: 0, y: 64 },
      right: { x: 0, y: 96 },
    };
  }

  /**
   * PRIVATE
   */

  /**
   * @desc Render a shadow beneath the player, assumes this is drawn before player
   * @method
   * 
   * @param {Object} ctx - Canvas context
   * @param {Object} camera - Camera object
   * @param {Number} xr - x-radius length
   * @param {Number} yr - y-radius length
   */
  __renderShadow(ctx, camera, xr, yr) {

    ctx.save();

    // Move camera into position
    ctx.translate(camera.offsetX, camera.offsetY);

    // Start tracing an ellipse
    ctx.beginPath();
    // Add values to x and y to center the shadow under the player sprite
    // WARN: If the player sprite changes, this may need to be changed
    ctx.ellipse(this.x+16, this.y+30, xr, yr, Math.PI/180, 0, 2 * Math.PI);

    ctx.restore();

    // Fill outside of shadow with a lighter shade of black to simulate
    // the shadow fading
    ctx.fillStyle = '#222222';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#333333';
    ctx.stroke();

    ctx.restore();

  }

  /**
   * PUBLIC
   */

    /**
   * @desc Add a direction to a player, typically based on what key is being pressed
   * @param {String} dir - String that represents a direction
   */
  addDirection(dir) {

    // Don't move if on title screen
    if (eh.state === 'paused') return;

    // Dont move if player holds down 3 or more keys 
    else if (this.direction.length > 1) return;

    else if (this.direction.indexOf(dir) === -1) {
      this.direction.push(dir);
      this.moving = true;
      this.idleDirection = dir;
    }
    
  }

  /**
   * @desc Make the player move faster by modifying their speed scale
   * @method
   */
  addSprint() {
    this.sprint = 2;
  }

  /**
   * @desc Retrn the player's boundary box
   * The changes to the top, right, bottom, and left seem pretty arbitrary
   * They are, but they help make the boundary box more accurate and feel better
   * @method
   * 
   * @return {Object} - Returns the player's hitbox/footprint
   */
  getBB() {
    return {
      top: this.y + this.height - 4,
      right: this.x + this.width - 10,
      bottom: this.y + this.height,
      left: this.x + 16,
    };
  }

  onStairs(environment) {

    for (let box of environment.stairBounds) {
      if (environment.isInside(this.getBB(), box)) return true;
    }

    return false;
 
  }
  

  /**
   * @desc Remove a direction, typically based on what key is being released
   * @param {String} dir - String that represents a direction
   */
  removeDirection(dir) {
    this.direction = this.direction.filter(d => d !== dir);
    this.moving = this.direction.length > 0;
  } 

  /**
   * @desc Return the player's speed to normal
   * @method
   */
  removeSprint() {
    this.sprint = 1;
  }

  /**
   * @desc Render player to the screen depending on whether they are moving or idle as well as determining which sprite or sprite set to render
   * @method
   * 
   * @param {Object} ctx - Canvas context
   * @param {Object} camera - Camera object
   */
  render(ctx, camera) {

    // Step 1: Render shadow

    // Since the player's occupied space looks visibly bigger when running, a larger shadow is used
    // for when the player is moving

    // Don't render shadow if debug mode is enabled since it interferes with the render of the boundary box
    if (!eh.keyEvents.debug)
      this.moving ? this.__renderShadow(ctx, camera, 6, 2) : this.__renderShadow(ctx, camera, 5, 2);

    // Step 2: Determine what direction the player is facing in an iso view
    
    // This is necessary since the player's animations are made with cartesian movements in mind, but
    // this game is currently isometric

    // Get player's current directin
    let dir = this.moving ? this.direction[0] : this.idleDirection;

    // Fix some basic animation issues that would make movment look wonky
    // if not here
    if (dir === 'down') dir = 'left';
    else if (dir === 'up') dir = 'right';

    // Change facing dir depending if multiple dirs are active
    // These happen when the player holds down multiple keys at once
    if (this.direction.includes('up') && this.direction.includes('right')) 
      dir = 'right';

    if (this.direction.includes('up') && this.direction.includes('left'))
      dir = 'up';

    if (this.direction.includes('down') && this.direction.includes('left'))
      dir = 'left';

    if (this.direction.includes('down') && this.direction.includes('right')) 
      dir = 'down';

    // If the player is holding down two conflicting keys, they should be idle and not move
    if (this.direction.includes('up') && this.direction.includes('down') ||
        this.direction.includes('left') && this.direction.includes('right')) {
      this.moving = false;
    }

    // Step 3: Render

    ctx.save();

    // Move camera to player location
    ctx.translate(camera.offsetX, camera.offsetY);

    // Draw boundary box
    if (eh.keyEvents.debug) {
      let box = this.getBB();
      ctx.strokeStyle = 'red';
      ctx.beginPath();
      ctx.moveTo(box.left, box.top);
      ctx.lineTo(box.left + (box.right - box.left) / 2, box.top + (box.bottom - box.top) / 2);
      ctx.lineTo(box.left, box.top + (box.bottom - box.top));
      ctx.lineTo(box.left - (box.right - box.left) / 2, box.top + (box.bottom - box.top) / 2);
      ctx.lineTo(box.left, box.top);
      ctx.stroke();
    } 

    // Draw running animation if moving
    if (this.moving) {
      ctx.drawImage(
        this.imgMoving,
        this.frames[dir][this.frame].x,
        this.frames[dir][this.frame].y,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
      ctx.restore();      
    } else {
      ctx.drawImage(
        this.imgIdle,
        this.idleFrames[dir].x,
        this.idleFrames[dir].y,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
      ctx.restore();
      return;
    }

    this.tickCount++;

    // Skip some frames so the animation isn't moving at hyperspeed
    if (this.tickCount < 5) return;

    // Cycle through frames
    this.tickCount = 0;
    
    // Cycle through frames. Add the -1 since we need to evaluate before incrementing
    // which prevents us from going over the array length
    this.frame === this.frames[dir].length - 1 ? this.frame = 0 : this.frame++;

  }

  /**
   * @desc Update the player's speed, direction, and prevent them from going oob
   * @method
   * 
   * @param {Object} environment - Environment object
   */
  update(environment) {
    let speed = this.speed * this.sprint;
    let origY = this.y;
    let origX = this.x;

    // Change speed depending on which direction the player is moving in
    // Since the width of tiles is greater than their hieght (though it doesnt look that way)
    // The player will not move directly on the iso grid.
    // Since the current settings have the length:width ratio at 2:1 the Y or X axis movement speed
    // must be compensated for, therefore we squash y movement speed by 2
    // WARN: if tile sizes change, this surely needs to be updated

    // Slow down doubly when moving diagonally
    if (this.direction.includes('up') && this.direction.includes('right')) 
      speed /= 2;

    else if (this.direction.includes('down') && this.direction.includes('left'))
      speed /= 2;

    // Divide y axis speed by 2 since that compensates for the difference between
    // tile length and width
    this.direction.forEach(dir => {
      if (dir === 'up') {
        this.y -= speed/2;
        this.x += speed;
      }
      if (dir === 'down') {
        this.y += speed/2;
        this.x -= speed;
      }
      if (dir === 'left') {
        this.y -= speed/2;
        this.x -= speed;
      }
      if (dir === 'right') {
        this.y += speed/2;
        this.x += speed;
      }
    });

    // Check to see if we bumped into anything! if we did, reset the position
    if (environment.isOutOfBounds(this.getBB())) {
      this.x = origX;
      this.y = origY;
      this.moving = false;
    }

    // TEST
    // see where player is in terms of map tiles
    // let cartX = this.x * this.width / 2;
    // let cartY = this.y * this.height;
    // let isoX = cartX - cartY;
    // let isoY = (cartX + cartY) / 2;

    // console.log('(' + Math.floor(isoX) + ')');

  }

}

// Player is a singleton, so just give anything that requires this access to the same object
// We don't need more than one player after all
module.exports = new Player();
