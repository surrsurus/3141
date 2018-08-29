const S = require('./settings');
const eh = require('./eventHandler');

const timerBuffer = 25;
const timerTransparency = 0.9;
const timerScale = 1;

const timerMinutes = 5;

/**
 * @desc Timer class handles generating and rendering a timer
 * @class
 */
class Timer {

  /**    
  * @desc Constructor for Timer
  */
  constructor() {

    self.start = new Date(Date.now());
    self.deadline = new Date(self.start.getTime() + timerMinutes*60000);

  }

  /**
   * @desc Render the timer to the screen 
   * @param {*} ctx 
   * @param {*}
   */
  render(ctx) {
    
    self.start = new Date(Date.now());
    var time = self.deadline - self.start;
    var seconds = Math.floor(time / 1000);
    var minute = Math.floor(seconds / 60);
    seconds = seconds % 60;

    if (time < 0.00) {
      eh.state = 'timer end';
    }
    
    ctx.fillStyle = 'rgba(30, 30, 30, ' + timerTransparency + ')';

    ctx.beginPath();
    ctx.moveTo(S.canvasWidth - timerBuffer - 100 * timerScale, S.canvasHeight - timerBuffer - 230 * timerScale);
    ctx.lineTo(S.canvasWidth - timerBuffer,                    S.canvasHeight - timerBuffer - 230 * timerScale);
    ctx.lineTo(S.canvasWidth - timerBuffer,                    S.canvasHeight - timerBuffer - 200);
    ctx.lineTo(S.canvasWidth - timerBuffer - 100 * timerScale, S.canvasHeight - timerBuffer - 200);
    ctx.lineTo(S.canvasWidth - timerBuffer - 100 * timerScale, S.canvasHeight - timerBuffer - 230 * timerScale);
    ctx.fill();

    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.font = '16px Arial';
    var timeText = null;
    if (seconds.toString().length < 2) {
      timeText = minute + ":0" + seconds
    } else {
      timeText = minute + ":" + seconds
    }
    ctx.fillText(timeText, 360, 36);

  }
    
  /**
  * @desc Update the timer
  * @method
  */
  update(dt) {

  }
    
}

module.exports = Timer;