// tabMessaging.cjs - CommonJS wrapper for Jest tests
const EXPECTED_ERROR_PATTERNS = [
  /receiving end does not exist/i,
  /message port closed/i,
  /no frame with id/i,
];

function isExpectedSendMessageError(error) {
  if (!error || typeof error.message !== 'string') {
    return false;
  }
  return EXPECTED_ERROR_PATTERNS.some((pattern) => pattern.test(error.message));
}

module.exports = { isExpectedSendMessageError };
