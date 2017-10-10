
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
  constructor(ctx) {

    // Current color rgb value (0 - 200)
    this.bg_shade = 0;

    // Create an array of colors
    this.bg_array = []

    for (let i = 0; i < 200; i++)
      this.bg_array.push('rgb(' + i + ', 0, 0)');

    for (let i = 200; i > 0; i--)
      this.bg_array.push('rgb(' + i + ', 0, 0)');

    for (let i = 0; i < 200; i++)
      this.bg_array.push('rgb( 0, ' + i + ', 0)');

    for (let i = 200; i > 0; i--)
      this.bg_array.push('rgb( 0, ' + i + ', 0)');

    for (let i = 0; i < 200; i++)
      this.bg_array.push('rgb( 0, 0, ' + i + ' )');

    for (let i = 200; i > 0; i--)
      this.bg_array.push('rgb( 0, 0, ' + i + ' )');

    // Timer based on tickrate
    this.tick_count = 0;

  }

  /**
   * @desc Render the background
   * Current background is a type of pulsing gradient that fades in and out
   * @method
   * 
   * @param {Objet} ctx - Canvas context 
   * @param {Object} camera - Camera object
   */
  render(ctx) {

    // Create a linear gradient that goes slightly off screen
    // This is so the gradient doesnt totally overwhelm the bg
    let grd=ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);

    // Set the top of the gradient to black
    grd.addColorStop(0,"black");

    // Update color
    if (this.tick_count === 2) {
      this.tick_count = 0;
      // Check to see if we need to loop back
      this.bg_shade === this.bg_array.length - 1 ? this.bg_shade = 0 : this.bg_shade++;
    }

    // Add the color to the bottom of the gradient for specific category
    grd.addColorStop(1, this.bg_array[this.bg_shade]);
    
    // Finally, draw gradient to the canvas
    ctx.fillStyle=grd;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
    ctx.save();

  }

  /**
   * @desc Update the background by incrementing the tick count
   * @param {Number} dt - Datetime 
   */
  update(dt) {
    this.tick_count++;
  }

}

module.exports = Background;