const { isSessionStorageAvailable } = require('../src/lib/storageAvailability.cjs');

describe('isSessionStorageAvailable', () => {
  test('returns true when chrome.storage.session is present', () => {
    expect(isSessionStorageAvailable({ session: {} })).toBe(true);
  });

  test('returns false when storage.session is missing (Chrome < 102)', () => {
    expect(isSessionStorageAvailable({})).toBe(false);
  });

  test('returns false when storage itself is missing', () => {
    expect(isSessionStorageAvailable(undefined)).toBe(false);
    expect(isSessionStorageAvailable(null)).toBe(false);
  });
});
