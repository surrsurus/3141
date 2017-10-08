/**
 * Hold the state of events
 */
const EventHandler = {
  state: 'paused',
  /**
   * Hold events triggered by keypresses
   */
  keyEvents: {
    // Start game from titlescreen
    gamePaused: true,
    // Regenerate map
    regenMap: false,
    // Toggle debug
    debug: false,
  }
};

module.exports = EventHandler;