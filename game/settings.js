// Mode
const debug = true;

// Screen size
const screenWidth = 965;
const screenHeight = 590;

// Canvas dimensions
const canvasWidth = 480;
const canvasHeight = 270;

if (canvasWidth > screenWidth || canvasHeight > screenHeight ) throw Exception('Canvas is larger than screen');

// The factor by which the canvas size is increased
const canvasMagnification = 2;
// The factor by which the camera offset is increased
const cameraOffset = 2;

// Image source for player spritesheet
const playerImageMoving = new Image();
playerImageMoving.src = './assets/player/player-spritesheet.png';

// Image source for player idle spritesheet
const playerImageIdle = new Image();
playerImageIdle.src = './assets/player/player-idle.png';

// Ammount of tiles in the map
// WARN: Stage must be odd sized
const mapWidth = 51;
const mapHeight = 51;

// Tile dimensions in pixels
const tileWidth = 80;
const tileHeight = 40;
const tileDepth = 10;

module.exports = {
    debug,

    screenWidth,
    screenHeight,
    
    canvasWidth,
    canvasHeight,

    canvasMagnification,
    cameraOffset,

    playerImageMoving,
    playerImageIdle,

    mapHeight,
    mapWidth,

    tileWidth,
    tileHeight,
    tileDepth
};