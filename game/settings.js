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

module.exports = {
    canvasMagnification,
    cameraOffset,

    playerImageMoving,
    playerImageIdle
};