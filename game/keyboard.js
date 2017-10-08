/**
 * Handle keyboard input for the player using keyboardjs
 * Keyboardjs makes handling multiple keypresses at one time work well
 */

const keyboard = require('keyboardjs');
const player = require('./player');
const eh = require('./eventHandler');

// Spit out keypresses for debugging
if (eh.keyEvents.debug) {
    document.addEventListener('keydown', (e) => {
        console.log(e);
  });
}

/**
 * Movement keys
 */
keyboard.bind('a', (e) => {
    player.addDirection('left');
}, (e) => {
    player.removeDirection('left');
});
  
keyboard.bind('w', (e) => {
    player.addDirection('up');
}, (e) => {
    player.removeDirection('up');
});
  
keyboard.bind('s', (e) => {
    player.addDirection('down');
}, (e) => {
    player.removeDirection('down');
});

keyboard.bind('d', (e) => {
    player.addDirection('right');
}, (e) => {
    player.removeDirection('right');
});

// Sprint
keyboard.bind('shift', (e) => {
    player.addSprint();
}, (e) => {
    player.removeSprint();
});

// Start game
keyboard.bind('enter', (e) => {
    eh.keyEvents.startGame = true;
});
  
// Toggle debug mode
keyboard.bind('e', (e) => {
    eh.keyEvents.debug = !eh.keyEvents.debug;
});

// Generate a new map
keyboard.bind('r', (e) => {
    eh.keyEvents.regenMap = !eh.keyEvents.regenMap;
});
  
