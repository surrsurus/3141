/**
 * Handles the map and it's generation
 */

const Dungeon = require('./dungeon/generator.js');
const eh = require('./eventHandler');
const U = require('./utils.js');
const S = require('./settings');
const turf = require('turf');
const overlaps = require('turf-overlaps');
const inside = require('turf-inside');
const _ = require('underscore');

/**
 * @desc Evironment class handles generating a map, giving it boundaries, and detecting when objects collide with the walls
 * @class
 */
class Environment {

  /**
   * @desc Constructor for Environment
   * Basically just establishes the x,y coords and boundary list as well as generates a dungeon
   * 
   * @constructor
   */
  constructor() {

    this.dungeon;
    
    this.bounds = [];
    this.stairBounds = [];

    this.genDungeon();

  }

  /**
   * PRIVATE
   */

  /**
   * @desc Outline the boundary boxes of an object
   * @method
   * 
   * @param {Number} x - x coord of object 
   * @param {*} y - y coord of object
   * @param {*} width - Width of object
   * @param {*} height - Height of object
   * @param {*} ctx - Canvas context
   */
  __drawBounds(x, y, width, height, ctx, color = '#ff0000') {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width / 2, y + height / 2);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x - width / 2, y + height / 2);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  /**
   * @desc Draw a tile to the screen
   * @method
   * 
   * @param {Number} x - x coord in the dungeon map
   * @param {Number} y - y coord in the dungeon map
   * @param {Object} ctx - Canvas context
   * @param {String} top - Top color
   * @param {String} side - Side color
   */
  __drawTile(x, y, ctx, top = '#eeeeee', side = '#dddddd') {

    let cartX = x * S.tileWidth / 2;
    let cartY = y * S.tileHeight;
    let isoX = cartX - cartY;
    let isoY = (cartX + cartY) / 2;
  
    // Step 1: Draw the sides
    ctx.fillStyle = side;
  
    // This code is basically outlining a polygon, then filling it
    // Each lineTo represents a side of the polygon
    ctx.beginPath();
    ctx.moveTo(isoX, isoY);                                           
    ctx.lineTo(isoX + S.tileWidth / 2, isoY + S.tileHeight / 2);     
    ctx.lineTo(isoX + S.tileWidth / 2, isoY + S.tileHeight / 2 + S.tileDepth);
    ctx.lineTo(isoX, isoY + S.tileHeight + S.tileDepth); 
    ctx.lineTo(isoX - S.tileWidth / 2, isoY + S.tileHeight / 2 + S.tileDepth);
    ctx.lineTo(isoX - S.tileWidth / 2, isoY + S.tileHeight / 2);      
    ctx.lineTo(isoX, isoY);                                           
    ctx.fill();

    // Step 2: Draw lines down the edges of the tile to make it seem like they are seperate tiles
    ctx.strokeStyle = top;

    // Only a few lines need to be rendered because neighboring tiles will create the illusion
    // they are all seperate
    ctx.beginPath();
    ctx.moveTo(isoX + S.tileWidth / 2, isoY + S.tileHeight / 2);
    ctx.lineTo(isoX + S.tileWidth / 2, isoY + S.tileHeight / 2 + S.tileDepth);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(isoX - S.tileWidth / 2, isoY + S.tileHeight / 2);
    ctx.lineTo(isoX - S.tileWidth / 2, isoY + S.tileHeight / 2 + S.tileDepth);
    ctx.stroke();

    // Step 3: Draw the tops
    ctx.fillStyle = top;

    // Draw similarly to the sides but forego the depth
    ctx.beginPath();
    ctx.moveTo(isoX, isoY);
    ctx.lineTo(isoX + S.tileWidth / 2, isoY + S.tileHeight / 2);
    ctx.lineTo(isoX, isoY + S.tileHeight);
    ctx.lineTo(isoX - S.tileWidth / 2, isoY + S.tileHeight / 2);
    ctx.lineTo(isoX, isoY);
    ctx.fill();
  }

  /**
   * @desc Generator method to iterate over the dungeon tiles
   * @generator
   * 
   * @param {Number} start - Lower bound of map, assumes map is square, default value is 0
   * @param {Number} end - Upper bound of map, assumes map is square, default value is dungeon.tiles.length
   * @yield {Object} Object with tile, x, and y properties
   */
  * __dungeonIter(start = 0, end = this.dungeon.tiles.length) {
    for (let x = 0; x < this.dungeon.tiles.length; x++) {
      for (let y = 0; y < this.dungeon.tiles.length; y++) {
        yield { data: this.dungeon.tiles[x][y], x: x, y: y };
      }
    }
  }

  /**
   * @desc Determines if two rectangles are overlapping
   * @method
   * 
   * @param {Object} r1 - First rectangle to compare
   * @param {Object} r2 - Second rectangle to compare
   * @return {Boolean} Returns true if overlapping, false if not
   */
  __intersectRect(r1, r2) {
    return (r2.left < r1.right ||
             r2.right > r1.left ||
             r2.top < r1.bottom ||
             r2.bottom > r1.top);
  }

  /**
   * @desc Add a set of cartesian boundaries to the boundary list after converting them to isometric
   * @method
   * 
   * @param {Number} x - x coord
   * @param {Number} y - y coord 
   */
  __pushBounds(x, y) {

    let cartX = x * S.tileWidth / 2;
    let cartY = y * S.tileHeight;
    let isoX = cartX - cartY;
    let isoY = (cartX + cartY) / 2;

    this.bounds.push({
      top: isoY,
      left: isoX,
      right: isoX + S.tileWidth,
      bottom: isoY + S.tileHeight
    });

  }

  /**
   * @desc Clear existing boundaries and set them for each tile in the dungeon map
   * WARNING: Enterprise quality code ahead
   * 
   * @method
   */
  __setBounds() {

    // Clear bounds
    this.bounds = [];
    this.stairBounds = [];
    
    // Purposefully trigger exceptions by accessing oob elements
    for (let tile of this.__dungeonIter(-2, this.dungeon.tiles.length + 1)) {

      try {
        
        // Walls recieve boundaries
        if (tile.data.type === 'wall') {
          this.__pushBounds(tile.x, tile.y);
        }

        else if (tile.data.type === 'stairs') {
          let cartX = tile.x * S.tileWidth / 2;
          let cartY = tile.y * S.tileHeight;
          let isoX = cartX - cartY;
          let isoY = (cartX + cartY) / 2;
      
          this.stairBounds.push({
            top: isoY,
            left: isoX,
            right: isoX + S.tileWidth,
            bottom: isoY + S.tileHeight
          });
        }
        
      }
        
      // Since index errors are bound to happen, we know that if an index error occurs,
      // the tile we're looking at doesn't exist on the map, therefore we can draw a boundary around it
      // to prevent player from leaving the map if a floor tile spawns on the edge
      catch (e) {
        this.__pushBounds(tile.x, tile.y);
      }

    }

  }

  /**
   * PUBLIC
   */

  /**
   * @desc Find the start of the map, usually the top-left most tile 
   * Good for setting the player location
   * TODO: Probably just want to make a function that gets a random tile instead
   * @method
   * 
   * @returns {Array} Array of isometric coords that represent the tile where the map starts
   */
  findStart() {
    let startX;
    let startY;

    for (let tile of this.__dungeonIter()) {

      if (tile.data.type !== 'wall') {

        // console.log(x, y);

        startX = tile.x * S.tileWidth / 2;
        startY = tile.y * S.tileHeight;

        return U.cart2Iso(startX, startY);

      }
    }
  
  }

  /**
   * @desc Generate a dungeon using the dungeon generator 
   * This also sets the bounds for the dungeon
   * 
   * @method
   */
  genDungeon() {

    // Generate a dungeon
    this.dungeon = new Dungeon().generate({
      width: S.mapWidth,
      height: S.mapHeight
    });
  
    this.__setBounds();


  }

  /**
   * @desc Determine if two isometric rectangles are intersecting
   * @method
   * 
   * @param {Object} r1 - Iso rectangle 1
   * @param {Object} r2 - Iso rectangle 2
   * @return {Boolean} True if they are overlapping, false if not
   */
  intersectIsometric(r1, r2) {
    // Check outer bounding box first
    if (!this.__intersectRect(r1, r2)) {
      return false;
    }
  
    let r1w = r1.right - r1.left;
    let r1h = r1.bottom - r1.top;
  
    let r2w = r2.right - r2.left;
    let r2h = r2.bottom - r2.top;
  
    // Create a polygon representing the first rectangle
    // Each array is a tuple of points, that you can think of the polygon object connecting the dots to
    // to form a polygon
    let poly1 = turf.polygon([[
      [r1.left, r1.top],
      [r1.left + r1w / 2, r1.top + r1h / 2],
      [r1.left, r1.top + r1h],
      [r1.left - r1w / 2, r1.top + r1h / 2],
      [r1.left, r1.top]
    ]]);
  
    let poly2 = turf.polygon([[
      [r2.left, r2.top],
      [r2.left + r2w / 2, r2.top + r2h / 2],
      [r2.left, r2.top + r2h],
      [r2.left - r2w / 2, r2.top + r2h / 2],
      [r2.left, r2.top]
    ]]);
  
    return overlaps(poly1, poly2);

  }

  /**
   * @desc Determines if r1 is inside r2
   * @param {Object} r1 - Thing you want on inside
   * @param {Object} r2 - Thing you want on outside
   */
  isInside(r1, r2) {

    let pt1 = turf.point([r1.left, r1.top]);


    let r2w = r2.right - r2.left;
    let r2h = r2.bottom - r2.top;
  
    let poly2 = turf.polygon([[
      [r2.left, r2.top],
      [r2.left + r2w / 2, r2.top + r2h / 2],
      [r2.left, r2.top + r2h],
      [r2.left - r2w / 2, r2.top + r2h / 2],
      [r2.left, r2.top]
    ]]);

    return inside(pt1, poly2);

  }

  /**
   * @desc Compare boundary boxes to determine if an entity moves out of bounds
   * @method
   * 
   * @param {Object} boundingBox - Object of entity that can go out of bounds
   * @return {Boolean} True if the object is out of bounds, false if it is not
   */
  isOutOfBounds(boundingBox) {

    // Basically just see if the bounding box overlaps any others
    for (let bound in this.bounds) {
      if (this.intersectIsometric(boundingBox, this.bounds[bound])) {
        return true;
      }
    }
  
    return false;

  }

  /**
   * @desc Render the map to the screen 
   * @param {*} ctx 
   * @param {*} camera 
   */
  render(ctx, camera) {
  
    ctx.translate(camera.offsetX, camera.offsetY);

    for (let tile of this.__dungeonIter()) {
      // Draw floor tiles as white tiles
      if (tile.data.type === 'floor')
        this.__drawTile(tile.x, tile.y, ctx);

      else if (tile.data.type === 'stairs')
        this.__drawTile(tile.x, tile.y, ctx, '#aaffaa', '#00ff00');

      // Draw door tiles as red tiles
      else if (tile.data.type === 'door')
        this.__drawTile(tile.x, tile.y, ctx, '#ffaaaa', '#ff0000');
    }
    
    // Draw the boundaries if debug is on
    if (eh.keyEvents.debug) {


      this.bounds.forEach((box) => {
        this.__drawBounds(box.left, box.top, box.right - box.left, box.bottom - box.top, ctx);
      });

      this.stairBounds.forEach((box) => {
        this.__drawBounds(box.left, box.top, box.right - box.left, box.bottom - box.top, ctx, '#0000ff');
      });

    }
  
    ctx.restore();

  }

  /**
   * @desc Render all objects in the foreground
   * WARN: Not used
   * @method
   * 
   * @param {Object} ctx - Canvas context
   * @param {Object} camera - Camera object
   */
  renderForeground(ctx, camera) {
    ctx.save();
    ctx.translate(camera.offsetX, camera.offsetY);
    // ctx.drawImage(this.foregroundImg, 0, 0);
    ctx.restore();
  }
  
  /**
   * @desc Update the environment and it's held objects
   * WARN: Clearly does nothing, but thats because the environment has nothing to update as of right now
   * @method
   */
  update() {}
  
}

module.exports = new Environment();
