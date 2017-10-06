/**
 * Handle keyboard input for the player using keyboardjs
 * Keyboardjs makes handling multiple keypresses at one time work well
 */

const keyboard = require('keyboardjs');
const player = require('./player');

if (global.debug) {
    document.addEventListener('keydown', function(e) {
        console.log(e);
  });
}

keyboard.bind('a', function(e) {
    player.addDirection('left');
}, function(e) {
    player.removeDirection('left');
});
  
keyboard.bind('w', function(e) {
    player.addDirection('up');
}, function(e) {
    player.removeDirection('up');
});
  
keyboard.bind('s', function(e) {
    player.addDirection('down');
}, function(e) {
    player.removeDirection('down');
});

keyboard.bind('d', function(e) {
    player.addDirection('right');
}, function(e) {
    player.removeDirection('right');
});

keyboard.bind('e', function(e) {
    global.debug = !global.debug;
});

keyboard.bind('r', function(e) {
    global.regen = !global.regen;
});
  
keyboard.bind('shift', function(e) {
    player.addSprint();
}, function(e) {
    player.removeSprint();
});
  