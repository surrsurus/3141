/**
 * Execute this script as soon as the body loads
 */

window.onload = function() {

  // Start game
  global.startGame = false;

  // Set debug mode
  global.debug = false;

  // Set regen mode
  // Determines if a new map is to be generated for debugging purposes
  global.regen = false;
    
  // Check if rot.js can work on this browser
  if (!ROT.isSupported()) alert("The rot.js library isn't supported by your browser.");

}