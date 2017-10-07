const S = require('./settings');

/**
 * @desc Basic camera class that updates to always be centered on the player
 * @class
 */
class Camera {
	
	/**
	 * @desc Constructor for Camera object
	 * @constructor
	 * 
	 * @param {Object} canvas 
	 * @param {Number} startX 
	 * @param {Number} startY 
	 */
	constructor(canvas, startX, startY) {
		this.offsetX = startX - canvas.width / S.cameraOffset;
		this.offsetY = startY - canvas.height / S.cameraOffset;
		this.width = canvas.width;
		this.height = canvas.height;
	}

	/**
	 * @desc Update function gets called every tick and by defaults always centers around the player
	 * @method
	 * 
	 * @param {Object} ctx 
	 * @param {Object} player 
	 */
	update(ctx, player) {
		this.offsetX = ctx.canvas.width / S.cameraOffset - player.x - player.width;
		this.offsetY = ctx.canvas.height / S.cameraOffset - player.y - player.height;
	}

}

module.exports = Camera;
