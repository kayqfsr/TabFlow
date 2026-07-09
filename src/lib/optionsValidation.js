// optionsValidation.js
const MIN_HISTORY_SIZE = 3;
const MAX_HISTORY_SIZE = 10;
const RANGE_ERROR_MESSAGE = 'Por favor, escolha um valor entre 3 e 10.';

export function getSaveValidationError(maxHistorySize) {
  if (
    !Number.isFinite(maxHistorySize) ||
    maxHistorySize < MIN_HISTORY_SIZE ||
    maxHistorySize > MAX_HISTORY_SIZE
  ) {
    return RANGE_ERROR_MESSAGE;
  }
  return null;
}
