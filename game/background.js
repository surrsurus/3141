
class Background {

  constructor() {
    this.bg_shade = 0;
    this.pulse_up = true;
  }

  render(ctx, canvas) {

    let grd=ctx.createLinearGradient(0, 0, 0, ctx.canvas.height + 100);

    grd.addColorStop(0,"black");

    if (this.bg_shade === 200) this.pulse_up = false;
    if (this.bg_shade === 0) this.pulse_up = true;

    grd.addColorStop(1,'rgb(0, 0, ' + this.bg_shade + ')');

    this.pulse_up ? this.bg_shade++ : this.bg_shade--; 

    ctx.fillStyle=grd;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
    ctx.save();

  }

}

module.exports = new Background();