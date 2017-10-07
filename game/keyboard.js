/**
 * Handle keyboard input for the player using keyboardjs
 * Keyboardjs makes handling multiple keypresses at one time work well
 */

const keyboard = require('keyboardjs');
const player = require('./player');

// Spit out keypresses for debugging
if (global.debug) {
    document.addEventListener('keydown', function(e) {
        console.log(e);
  });
}

/**
 * Movement keys
 */
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

// Sprint
keyboard.bind('shift', function(e) {
    player.addSprint();
}, function(e) {
    player.removeSprint();
});
  
// Toggle debug mode
keyboard.bind('e', function(e) {
    global.debug = !global.debug;
});

// Generate a new map
keyboard.bind('r', function(e) {
    global.regen = !global.regen;
});
  
