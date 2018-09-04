/**
 * Hold the state of events
 */
const EventHandler = {
  state: 'null',
  /**
   * Hold events triggered by keypresses
   */
  keyEvents: {
    // Regenerate map
    regenMap: false,
    // new game
    newGame: false,
    // Toggle debug
    debug: false,
    // Toggle BG
    background: false
  }
};

module.exports = EventHandler;