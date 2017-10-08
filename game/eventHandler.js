/**
 * Hold the state of events
 */
const EventHandler = {
  /**
   * Hold events triggered by keypresses
   */
  keyEvents: {
    // Start game from titlescreen
    startGame: false,
    // Regenerate map
    regenMap: false,
    // Toggle debug
    debug: false,
  }
};

module.exports = EventHandler;