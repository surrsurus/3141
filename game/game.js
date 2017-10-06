const player = require('./player');
const Camera = require('./camera');
const environment = require('./environment');
const keyboard = require('./keyboard');
const S = require('./settings');

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

class Game {

  constructor() {

    ctx.imageSmoothingEnabled = false;

    canvas.width = 480;
    canvas.height = 270;

    // Magnify the canvas
    canvas.style.width = canvas.width * S.canvasMagnification + 'px';
    canvas.style.height = canvas.height * S.canvasMagnification + 'px';

    [player.x, player.y] = environment.findStart();

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
let lastTime;
const main = () => {

  let now = Date.now();
  let dt = (now - lastTime) / 1000.0;

  game.update(dt);
  game.render();

  lastTime = now;
  requestAnimationFrame(main);

};

main();
