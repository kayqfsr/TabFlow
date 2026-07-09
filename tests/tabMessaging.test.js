const {
  isExpectedSendMessageError,
  getBroadcastTargetTabIds,
} = require('../src/lib/tabMessaging.cjs');

describe('isExpectedSendMessageError', () => {
  test('treats "receiving end does not exist" as expected (tab has no content script)', () => {
    const error = new Error('Could not establish connection. Receiving end does not exist.');
    expect(isExpectedSendMessageError(error)).toBe(true);
  });

  test('treats "message port closed" as expected (tab navigated away mid-flight)', () => {
    const error = new Error('The message port closed before a response was received.');
    expect(isExpectedSendMessageError(error)).toBe(true);
  });

  test('treats a frame-was-removed message as expected', () => {
    const error = new Error('No frame with id 0 in tab 42.');
    expect(isExpectedSendMessageError(error)).toBe(true);
  });

  test('treats other errors as unexpected', () => {
    const error = new Error('Something else went wrong');
    expect(isExpectedSendMessageError(error)).toBe(false);
  });

  test('treats a missing/malformed error as unexpected', () => {
    expect(isExpectedSendMessageError(null)).toBe(false);
    expect(isExpectedSendMessageError({})).toBe(false);
  });
});

describe('getBroadcastTargetTabIds', () => {
  test('includes tabs currently in history', () => {
    expect(getBroadcastTargetTabIds([], [1, 2, 3])).toEqual(expect.arrayContaining([1, 2, 3]));
  });

  test('includes tabs that just fell out of history so their badge can be cleared', () => {
    const targets = getBroadcastTargetTabIds([1, 2, 3], [1, 2]);
    expect(targets).toEqual(expect.arrayContaining([1, 2, 3]));
  });

  test('never includes a tab that was neither previously nor currently tracked', () => {
    const targets = getBroadcastTargetTabIds([1, 2], [1, 3]);
    expect(targets).not.toContain(99);
  });

  test('does not duplicate tab ids present in both sets', () => {
    const targets = getBroadcastTargetTabIds([1, 2], [2, 3]);
    expect(targets).toHaveLength(3);
  });
});
