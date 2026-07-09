// messageValidation.cjs - CommonJS wrapper for Jest tests
const MIN_HISTORY_SIZE = 3;
const MAX_HISTORY_SIZE = 10;

function isValidMaxHistorySize(value) {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= MIN_HISTORY_SIZE &&
    value <= MAX_HISTORY_SIZE
  );
}

function isTrustedSender(sender, extensionId) {
  return Boolean(sender && sender.id === extensionId);
}

module.exports = { MIN_HISTORY_SIZE, MAX_HISTORY_SIZE, isValidMaxHistorySize, isTrustedSender };
