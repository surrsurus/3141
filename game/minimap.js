const S = require('./settings');

const minimapBuffer = 25;
const minimapTransparency = 0.75;

/**
 * @desc Minimap class handles generating and rending a minimap based on the current environment
 * @class
 */
class Minimap {

  /**    
  * @desc Constructor for Environment
  * Basically just establishes the x,y coords and boundary list as well as generates a dungeon
  * 
  * @constructor
  */
  constructor(environment) {
    
    this.changed = true;

  }

  drawBlip(x, y, ctx, color) {

    // the way the environment is rendered is pretty weird, its rotates about 180 degrees from how it actually looks as a 2d grid.

    var nx = (x * -1);
    var ny = (y * -1);

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(S.canvasWidth - minimapBuffer - S.mapWidth - nx + 1, S.canvasHeight - minimapBuffer - S.mapHeight - ny + 1);
    ctx.lineTo(S.canvasWidth - minimapBuffer - S.mapWidth - nx + 1, S.canvasHeight - minimapBuffer - S.mapHeight - ny);
    ctx.lineTo(S.canvasWidth - minimapBuffer - S.mapWidth - nx, S.canvasHeight - minimapBuffer - S.mapHeight - ny);
    ctx.lineTo(S.canvasWidth - minimapBuffer - S.mapWidth - nx, S.canvasHeight - minimapBuffer - S.mapHeight - ny + 1);
    ctx.lineTo(S.canvasWidth - minimapBuffer - S.mapWidth - nx + 1, S.canvasHeight - minimapBuffer - S.mapHeight - ny + 1);
    ctx.fill();
  }

  /**
   * @desc Render the map to the screen 
   * @param {*} ctx 
   * @param {*} env
   */
  render(ctx, environment) {

    if (this.changed) {
      ctx.fillStyle = 'rgba(30, 30, 30, ' + minimapTransparency + ')';
      ctx.beginPath();
      ctx.moveTo(S.canvasWidth - minimapBuffer - S.mapWidth * 2, S.canvasHeight - minimapBuffer - S.mapHeight * 2);
      ctx.lineTo(S.canvasWidth - minimapBuffer, S.canvasHeight - minimapBuffer - S.mapHeight * 2);
      ctx.lineTo(S.canvasWidth - minimapBuffer, S.canvasHeight - minimapBuffer);
      ctx.lineTo(S.canvasWidth - minimapBuffer - S.mapWidth * 2, S.canvasHeight - minimapBuffer);
      ctx.lineTo(S.canvasWidth - minimapBuffer - S.mapWidth * 2, S.canvasHeight - minimapBuffer - S.mapHeight * 2);
      ctx.fill();

      for (let tile of environment.dungeonIter()) {
        // Draw floor tiles as white tiles
        if (tile.data.type === 'floor')
          this.drawBlip(tile.x, tile.y, ctx, 'rgba(0, 0, 0, ' + minimapTransparency + ')');
  
        else if (tile.data.type === 'stairs')
          this.drawBlip(tile.x, tile.y, ctx, 'rgba(0, 255, 0, ' + minimapTransparency + ')');
  
        // Draw door tiles as red tiles
        else if (tile.data.type === 'door')
          this.drawBlip(tile.x, tile.y, ctx, 'rgba(255, 0, 0, ' + minimapTransparency + ')');
      }

    }

  }
    
  /**
  * @desc Update the minimap and it's held objects
  * WARN: Clearly does nothing, but thats because the minimap has nothing to update as of right now
  * @method
  */
  update(dt) {

  }
    
}

module.exports = Minimap;