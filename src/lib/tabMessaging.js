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
 * Calcula quais abas devem receber a notificação de mudança de histórico:
 * as que estão no histórico atual e as que acabaram de sair dele (para
 * que seu badge seja limpo), sem tocar em abas nunca rastreadas.
 * @param {Array<number>} previousTabIds - IDs presentes no histórico antes da mudança
 * @param {Array<number>} currentTabIds - IDs presentes no histórico após a mudança
 * @returns {Array<number>}
 */
export function getBroadcastTargetTabIds(previousTabIds, currentTabIds) {
  return Array.from(new Set([...previousTabIds, ...currentTabIds]));
}
