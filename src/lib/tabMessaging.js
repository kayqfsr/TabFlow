// tabMessaging.js
const EXPECTED_ERROR_PATTERNS = [
  /receiving end does not exist/i,
  /message port closed/i,
  /no frame with id/i,
];

export function isExpectedSendMessageError(error) {
  if (!error || typeof error.message !== 'string') {
    return false;
  }
  return EXPECTED_ERROR_PATTERNS.some((pattern) => pattern.test(error.message));
}

/**
 * Computes which tabs should receive the history-change notification:
 * those currently in history plus those that just left it (so their
 * badge gets cleared), without touching tabs that were never tracked.
 * @param {Array<number>} previousTabIds - IDs present in history before the change
 * @param {Array<number>} currentTabIds - IDs present in history after the change
 * @returns {Array<number>}
 */
export function getBroadcastTargetTabIds(previousTabIds, currentTabIds) {
  return Array.from(new Set([...previousTabIds, ...currentTabIds]));
}
