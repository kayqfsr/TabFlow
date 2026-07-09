const { TabHistoryManager } = require('../src/lib/historyLogic.cjs');
const { resolvePositionResponse } = require('../src/lib/positionRequest.cjs');

describe('resolvePositionResponse', () => {
  test('returns the position of a tracked tab', () => {
    const manager = new TabHistoryManager(3);
    manager.activateTab(10);
    manager.activateTab(20);

    expect(resolvePositionResponse(manager, 20)).toEqual({ position: 0 });
    expect(resolvePositionResponse(manager, 10)).toEqual({ position: 1 });
  });

  test('returns -1 for a tab outside the history', () => {
    const manager = new TabHistoryManager(3);
    manager.activateTab(10);

    expect(resolvePositionResponse(manager, 999)).toEqual({ position: -1 });
  });
});
