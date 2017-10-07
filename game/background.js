
/**
 * @desc Handle drawing stuff on the background of the canvas
 * Naturally, this gets rendered first
 * @class
 */
class Background {

  /**
   * @desc Constructor for Background. Only holds vars for a pulsing background
   * @constructor
   */
  constructor() {
    this.bg_shade = 0;
    this.pulse_up = true;
  }

  /**
   * @desc Render the background
   * Current background is a type of pulsing gradient that fades in and out
   * @method
   * 
   * @param {Objet} ctx - Canvas context 
   * @param {Object} camera - Camera object
   */
  render(ctx, camera) {

    // Create a linear gradient that goes slightly off screen
    // This is so the gradient doesnt totally overwhelm the bg
    let grd=ctx.createLinearGradient(0, 0, 0, ctx.canvas.height + 100);

    // Set the top of the gradient to black
    grd.addColorStop(0,"black");

    // Check to see if we need to change what direction the color is moving
    if (this.bg_shade === 200) this.pulse_up = false;
    if (this.bg_shade === 0) this.pulse_up = true;

    // Add the color to the bottom of the gradient
    grd.addColorStop(1,'rgb(0, 0, ' + this.bg_shade + ')');

    // Increment/decrement color. This creates the pulsing effect
    this.pulse_up ? this.bg_shade++ : this.bg_shade--; 

    // Finally, draw gradient to the canvas
    ctx.fillStyle=grd;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
    ctx.save();

  }

}

module.exports = Background;