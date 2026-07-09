const { isValidMaxHistorySize, isTrustedSender } = require('../src/lib/messageValidation.cjs');

describe('isValidMaxHistorySize', () => {
  test('accepts integers within the 3-10 range', () => {
    expect(isValidMaxHistorySize(3)).toBe(true);
    expect(isValidMaxHistorySize(5)).toBe(true);
    expect(isValidMaxHistorySize(10)).toBe(true);
  });

  test('rejects values below the minimum', () => {
    expect(isValidMaxHistorySize(2)).toBe(false);
  });

  test('rejects values above the maximum', () => {
    expect(isValidMaxHistorySize(11)).toBe(false);
  });

  test('rejects non-integer numbers', () => {
    expect(isValidMaxHistorySize(5.5)).toBe(false);
  });

  test('rejects non-numeric values', () => {
    expect(isValidMaxHistorySize('5')).toBe(false);
    expect(isValidMaxHistorySize(NaN)).toBe(false);
    expect(isValidMaxHistorySize(null)).toBe(false);
    expect(isValidMaxHistorySize(undefined)).toBe(false);
    expect(isValidMaxHistorySize({})).toBe(false);
  });
});

describe('isTrustedSender', () => {
  const EXTENSION_ID = 'abcdefghijklmnopabcdefghijklmnop';

  test('accepts a sender belonging to the extension itself', () => {
    expect(isTrustedSender({ id: EXTENSION_ID }, EXTENSION_ID)).toBe(true);
  });

  test('rejects a sender from a different extension', () => {
    expect(isTrustedSender({ id: 'someotherextensionid00000000000' }, EXTENSION_ID)).toBe(false);
  });

  test('rejects a sender without an id', () => {
    expect(isTrustedSender({}, EXTENSION_ID)).toBe(false);
    expect(isTrustedSender(null, EXTENSION_ID)).toBe(false);
  });
});
