global.DEBUG = false;

const player = require('./player');
const Camera = require('./camera');
const environment = require('./environment');
const keyboard = require('./keyboard');

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

class Game {

  constructor() {

    ctx.imageSmoothingEnabled = false;
    
    canvas.width = 480;
    canvas.height = 270;
    
    canvas.style.width = '960px';
    canvas.style.height = '540px';

    this.camera = new Camera(canvas, 0, 0);

  }

  update(dt) {

    environment.update(dt);
    this.camera.update(ctx, player);
    player.update(environment);

  }

  render() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    environment.render(ctx, this.camera);
    player.render(ctx, this.camera);
  
    environment.renderForeground(ctx, this.camera);

  }

}

// The main game loop

const game = new Game();

var lastTime;
const main = () => {
  var now = Date.now();
  var dt = (now - lastTime) / 1000.0;

  game.update(dt);
  game.render();

  lastTime = now;
  requestAnimationFrame(main);
};

main();