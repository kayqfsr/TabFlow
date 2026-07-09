// optionsValidation.cjs - CommonJS wrapper for Jest tests
const { MIN_HISTORY_SIZE, MAX_HISTORY_SIZE } = require('./messageValidation.cjs');

const RANGE_ERROR_MESSAGE = `Por favor, escolha um valor entre ${MIN_HISTORY_SIZE} e ${MAX_HISTORY_SIZE}.`;

function getSaveValidationError(maxHistorySize) {
  if (
    !Number.isFinite(maxHistorySize) ||
    maxHistorySize < MIN_HISTORY_SIZE ||
    maxHistorySize > MAX_HISTORY_SIZE
  ) {
    return RANGE_ERROR_MESSAGE;
  }
  return null;
}

module.exports = { getSaveValidationError, MIN_HISTORY_SIZE, MAX_HISTORY_SIZE };
