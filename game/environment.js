/**
 * Handles the map and it's generation
 */

const Dungeon = require('./dungeon/generator.js');
const U = require('./utils.js');
const S = require('./settings');
const turf = require('turf');
const overlaps = require('turf-overlaps');
const _ = require('underscore');

/**
 * @desc Evironment class handles generating a map, giving it boundaries, and detecting when objects collide with the walls
 * @class
 */
class Environment {

  /**
   * @desc Constructor for Environment
   * @constructor
   */
  constructor() {

    this.dungeon;
    
    this.x;
    this.y;
    this.bounds = [];
  
    this.matrix = [];
    this.fineMatrix;

    this.genDungeon();

  }

  genDungeon() {

    // Generate a dungeon
    this.dungeon = new Dungeon().generate({
      width: S.mapWidth,
      height: S.mapHeight
    });

    this.x = 0;
    this.y = 0;
    this.bounds = [];
  
    this.setBounds();
  
    this.matrix = [];
  
    for (let y = 0; y < this.dungeon.tiles[0].length; y++) {
      this.matrix.push([]);
  
      for (let x = 0; x < this.dungeon.tiles.length; x++) {
        this.matrix[y].push(this.dungeon.tiles[x][y].type === 'wall' ? 1 : 0);
      }
    }
  
    let fineMatrix = _.range(1, this.dungeon.tiles[0].length * 5);
  
    let mat = this.matrix;
    let yLen = mat.length * 5;
    let xLen = mat[0].length * 5;
    let range = _.range(1, this.dungeon.tiles.length * 5);
    for (let y = 0; y < yLen; y += 5) {
      fineMatrix[y] = range.slice();
  
      for (let x = 0; x < xLen; x += 5) {
        let bit = this.matrix[y / 5][x / 5];
        fineMatrix[y][x] = bit;
        fineMatrix[y][x + 1] = bit;
        fineMatrix[y][x + 2] = bit;
        fineMatrix[y][x + 3] = bit;
        fineMatrix[y][x + 4] = bit;
      }
  
      fineMatrix[y + 1] = fineMatrix[y];
      fineMatrix[y + 2] = fineMatrix[y];
      fineMatrix[y + 3] = fineMatrix[y];
      fineMatrix[y + 4] = fineMatrix[y];
    }
  
    this.fineMatrix = fineMatrix;

  }

  setBounds() {
    this.bounds = [];
    
    // Purposefully trigger exceptions by accessing oob elements
    for (let x = -1; x < this.dungeon.tiles.length + 1; x++) {

      for (let y = -1; y < this.dungeon.tiles.length + 1; y++) {

        try {
          if (this.dungeon.tiles[x][y].type === 'wall') {
            this.pushBounds(x, y);
          }
        }
        // Since index errors are bound to happen, we know that if an index error occurs,
        // the tile we're looking at doesn't exist on the map, therefore we can draw a boundary around it
        // to prevent player from leaving the map if a floor tile spawns on the edge
        catch (e) {
          this.pushBounds(x, y);
        }

      }

    }

  }

  intersectRect(r1, r2) {
    return (r2.left < r1.right ||
             r2.right > r1.left ||
             r2.top < r1.bottom ||
             r2.bottom > r1.top);
  }

  pushBounds(x, y) {
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

  findStart() {
    let startX;
    let startY;
    let done = false;
    for (let x = 0; x < this.dungeon.tiles.length; x++) {
      if (done) {
        break;
      }
      for (let y = 0; y < this.dungeon.tiles.length; y++) {
        if (this.dungeon.tiles[x][y].type !== 'wall') {
          console.log(x, y);
          // startX = x * S.tileWidth / 2 + S.tileWidth / 2;
          // startY = y * S.tileHeight + S.tileHeight / 2;
          startX = x * S.tileWidth / 2;
          startY = y * S.tileHeight;
          done = true;
          break;
        }
      }
    }
  
    return U.cart2Iso(startX, startY);
  }

  update() {}

  render(ctx, camera) {

    let grd=ctx.createLinearGradient(0, 0, 0, ctx.canvas.height + 1000);
    grd.addColorStop(0,"black");
    grd.addColorStop(1,"#FFBF00");
    ctx.fillStyle=grd;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
    ctx.save();
  
    ctx.translate(camera.offsetX, camera.offsetY);
  
    ctx.fillStyle = 'red';
  
    for (let i = 0; i < this.dungeon.tiles.length; i++) {
      for (let j = 0; j < this.dungeon.tiles.length; j++) {
        if (this.dungeon.tiles[i][j].type === 'floor') {
          this.drawTile(i, j, ctx);
  
        }
        if (this.dungeon.tiles[i][j].type === 'door') {
          this.drawTile(i, j, ctx, '#ffaaaa', '#ff0000');
        }
      }
    }
  
    if (global.debug) {
      ctx.strokeStyle = 'red';
      this.bounds.forEach((box) => {
        this.outlineBounds(box.left, box.top, box.right - box.left, box.bottom - box.top, ctx);
      });
    }
  
    ctx.restore();
  }

  sideFade(x, y, h, ctx, side) {
    for (let i = 0; i < h; i++) {
      ctx.fillStyle = 'rgb(' + side - (17 * i) +', ' + side - (17 * i) + ', ' + side - (17 * i)+ ')';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + S.tileWidth / 2, y + S.tileHeight / 2);
      ctx.lineTo(x + S.tileWidth / 2, y + S.tileHeight / 2 + 30);
      ctx.lineTo(x, y + S.tileHeight + 30);
      ctx.lineTo(x - S.tileWidth / 2, y + S.tileHeight / 2 + 30);
      ctx.lineTo(x - S.tileWidth / 2, y + S.tileHeight / 2);
      ctx.lineTo(x, y);
      ctx.fill();
    }
  }

  drawTile(x, y, ctx, top = '#eeeeee', side = '#dddddd') {
    let cartX = x * S.tileWidth / 2;
    let cartY = y * S.tileHeight;
    let isoX = cartX - cartY;
    let isoY = (cartX + cartY) / 2;
  
    ctx.fillStyle = side;
  
    ctx.beginPath();
    ctx.moveTo(isoX, isoY);
    ctx.lineTo(isoX + S.tileWidth / 2, isoY + S.tileHeight / 2);
    ctx.lineTo(isoX + S.tileWidth / 2, isoY + S.tileHeight / 2 + 10);
    ctx.lineTo(isoX, isoY + S.tileHeight + 10);
    ctx.lineTo(isoX - S.tileWidth / 2, isoY + S.tileHeight / 2 + 10);
    ctx.lineTo(isoX - S.tileWidth / 2, isoY + S.tileHeight / 2);
    ctx.lineTo(isoX, isoY);
    ctx.fill();

    ctx.fillStyle = top;
  
    ctx.beginPath();
    ctx.moveTo(isoX, isoY);
    ctx.lineTo(isoX + S.tileWidth / 2, isoY + S.tileHeight / 2);
    ctx.lineTo(isoX, isoY + S.tileHeight);
    ctx.lineTo(isoX - S.tileWidth / 2, isoY + S.tileHeight / 2);
    ctx.lineTo(isoX, isoY);
    ctx.fill();
  }
  
  outlineBounds(x, y, width, height, ctx) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width / 2, y + height / 2);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x - width / 2, y + height / 2);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  renderForeground(ctx, camera) {
    ctx.save();
    ctx.translate(camera.offsetX, camera.offsetY);
    // ctx.drawImage(this.foregroundImg, 0, 0);
    ctx.restore();
  }

  isOutOfBounds(boundingBox) {
    let oob = false;
    for (let i = 0; i < this.bounds.length; i++) {
      if (this.intersectIsometric(boundingBox, this.bounds[i])) {
        oob = true;
        break;
      }
    }
  
    return oob;
  }

  intersectIsometric(r1, r2) {
    // Check outer bounding box first
    if (!this.intersectRect(r1, r2)) {
      return false;
    }
  
    let r1w = r1.right - r1.left;
    let r1h = r1.bottom - r1.top;
  
    let r2w = r2.right - r2.left;
    let r2h = r2.bottom - r2.top;
  
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
  
}

module.exports = new Environment();
