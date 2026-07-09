// historyLogic.js
export class TabHistoryManager {
  constructor(maxSize = 5) {
    this.history = [];
    this.maxSize = maxSize;
  }

  activateTab(tabId) {
    this.history = this.history.filter((id) => id !== tabId);
    this.history.unshift(tabId);
    if (this.history.length > this.maxSize) {
      this.history = this.history.slice(0, this.maxSize);
    }
  }

  /**
   * Restores history from a previously saved state
   * @param {Array<number>} historyArray - Array of tab IDs saved previously
   */
  hydrate(historyArray) {
    if (Array.isArray(historyArray)) {
      this.history = historyArray.slice(0, this.maxSize);
    }
  }

  /**
   * Returns a tab's position in history (0 = most recent)
   * @param {number} tabId - The tab ID
   * @returns {number} - Position, or -1 if not in history
   */
  getPosition(tabId) {
    return this.history.indexOf(tabId);
  }

  /**
   * Calculates opacity based on position (kept for backwards compatibility, even though badges are used now)
   */
  calculateOpacity(position) {
    if (position === -1) return 1;
    return Math.max(0.5, 1 - position * 0.25);
  }

  /**
   * Sets the maximum history size
   * @param {number} size - New maximum size
   */
  setMaxSize(size) {
    this.maxSize = size;
    // Trim history if needed
    if (this.history.length > this.maxSize) {
      this.history = this.history.slice(0, this.maxSize);
    }
  }

  /**
   * Returns the current history
   * @returns {Array<number>} - Array of tab IDs
   */
  getHistory() {
    return [...this.history];
  }
}
