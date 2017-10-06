/**
 * Execute this script as soon as the body loads
 */

window.onload = function() {

  // Set debug mode
  global.debug = false;

  // Set regen mode
  global.regen = false;
    
  // Check if rot.js can work on this browser
  if (!ROT.isSupported()) alert("The rot.js library isn't supported by your browser.");

}