const { getSaveValidationError } = require('../src/lib/optionsValidation.cjs');

describe('getSaveValidationError', () => {
  test('returns null for values within the accepted range', () => {
    expect(getSaveValidationError(3)).toBeNull();
    expect(getSaveValidationError(5)).toBeNull();
    expect(getSaveValidationError(10)).toBeNull();
  });

  test('returns an error message for values below the minimum', () => {
    expect(getSaveValidationError(2)).toBe('Please choose a value between 3 and 10.');
  });

  test('returns an error message for values above the maximum', () => {
    expect(getSaveValidationError(11)).toBe('Please choose a value between 3 and 10.');
  });

  test('returns an error message for non-numeric values', () => {
    expect(getSaveValidationError(NaN)).toBe('Please choose a value between 3 and 10.');
  });
});
