// messageValidation.js
export const MIN_HISTORY_SIZE = 3;
export const MAX_HISTORY_SIZE = 10;

export function isValidMaxHistorySize(value) {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= MIN_HISTORY_SIZE &&
    value <= MAX_HISTORY_SIZE
  );
}

export function isTrustedSender(sender, extensionId) {
  return Boolean(sender && sender.id === extensionId);
}
