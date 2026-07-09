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
