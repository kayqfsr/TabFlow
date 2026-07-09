// optionsValidation.js
export { MIN_HISTORY_SIZE, MAX_HISTORY_SIZE } from './messageValidation.js';
import { MIN_HISTORY_SIZE, MAX_HISTORY_SIZE } from './messageValidation.js';

const RANGE_ERROR_MESSAGE = `Please choose a value between ${MIN_HISTORY_SIZE} and ${MAX_HISTORY_SIZE}.`;

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
