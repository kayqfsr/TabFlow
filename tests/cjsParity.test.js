const { runEsmProbe } = require('./helpers/runEsmProbe.js');

describe('.js/.cjs module pairs stay behaviorally in sync', () => {
  test('messageValidation.js matches messageValidation.cjs', () => {
    const cjs = require('../src/lib/messageValidation.cjs');
    const probe = `
      return {
        MIN_HISTORY_SIZE: mod.MIN_HISTORY_SIZE,
        MAX_HISTORY_SIZE: mod.MAX_HISTORY_SIZE,
        validLow: mod.isValidMaxHistorySize(3),
        validHigh: mod.isValidMaxHistorySize(10),
        invalidLow: mod.isValidMaxHistorySize(2),
        invalidHigh: mod.isValidMaxHistorySize(11),
        trusted: mod.isTrustedSender({ id: 'ext-1' }, 'ext-1'),
        untrusted: mod.isTrustedSender({ id: 'ext-2' }, 'ext-1'),
      };
    `;
    expect(runEsmProbe('src/lib/messageValidation.js', probe)).toEqual({
      MIN_HISTORY_SIZE: cjs.MIN_HISTORY_SIZE,
      MAX_HISTORY_SIZE: cjs.MAX_HISTORY_SIZE,
      validLow: cjs.isValidMaxHistorySize(3),
      validHigh: cjs.isValidMaxHistorySize(10),
      invalidLow: cjs.isValidMaxHistorySize(2),
      invalidHigh: cjs.isValidMaxHistorySize(11),
      trusted: cjs.isTrustedSender({ id: 'ext-1' }, 'ext-1'),
      untrusted: cjs.isTrustedSender({ id: 'ext-2' }, 'ext-1'),
    });
  });

  test('optionsValidation.js matches optionsValidation.cjs', () => {
    const cjs = require('../src/lib/optionsValidation.cjs');
    const probe = `
      return {
        MIN_HISTORY_SIZE: mod.MIN_HISTORY_SIZE,
        MAX_HISTORY_SIZE: mod.MAX_HISTORY_SIZE,
        ok: mod.getSaveValidationError(5),
        tooLow: mod.getSaveValidationError(1),
        tooHigh: mod.getSaveValidationError(20),
      };
    `;
    expect(runEsmProbe('src/lib/optionsValidation.js', probe)).toEqual({
      MIN_HISTORY_SIZE: cjs.MIN_HISTORY_SIZE,
      MAX_HISTORY_SIZE: cjs.MAX_HISTORY_SIZE,
      ok: cjs.getSaveValidationError(5),
      tooLow: cjs.getSaveValidationError(1),
      tooHigh: cjs.getSaveValidationError(20),
    });
  });

  test('tabMessaging.js matches tabMessaging.cjs', () => {
    const cjs = require('../src/lib/tabMessaging.cjs');
    const probe = `
      return {
        expected: mod.isExpectedSendMessageError(new Error('Receiving end does not exist.')),
        unexpected: mod.isExpectedSendMessageError(new Error('boom')),
        targets: mod.getBroadcastTargetTabIds([1, 2, 3], [2, 3, 4]),
      };
    `;
    expect(runEsmProbe('src/lib/tabMessaging.js', probe)).toEqual({
      expected: cjs.isExpectedSendMessageError(new Error('Receiving end does not exist.')),
      unexpected: cjs.isExpectedSendMessageError(new Error('boom')),
      targets: cjs.getBroadcastTargetTabIds([1, 2, 3], [2, 3, 4]),
    });
  });

  test('storageAvailability.js matches storageAvailability.cjs', () => {
    const cjs = require('../src/lib/storageAvailability.cjs');
    const probe = `
      return {
        withSession: mod.isSessionStorageAvailable({ session: {} }),
        withoutSession: mod.isSessionStorageAvailable({}),
        nullStorage: mod.isSessionStorageAvailable(null),
      };
    `;
    expect(runEsmProbe('src/lib/storageAvailability.js', probe)).toEqual({
      withSession: cjs.isSessionStorageAvailable({ session: {} }),
      withoutSession: cjs.isSessionStorageAvailable({}),
      nullStorage: cjs.isSessionStorageAvailable(null),
    });
  });

  test('positionRequest.js matches positionRequest.cjs', () => {
    const cjs = require('../src/lib/positionRequest.cjs');
    const fakeManager = { getPosition: (id) => (id === 5 ? 2 : -1) };
    const probe = `
      const fakeManager = { getPosition: (id) => (id === 5 ? 2 : -1) };
      return {
        found: mod.resolvePositionResponse(fakeManager, 5),
        notFound: mod.resolvePositionResponse(fakeManager, 999),
      };
    `;
    expect(runEsmProbe('src/lib/positionRequest.js', probe)).toEqual({
      found: cjs.resolvePositionResponse(fakeManager, 5),
      notFound: cjs.resolvePositionResponse(fakeManager, 999),
    });
  });

  test('onceInit.js matches onceInit.cjs', async () => {
    const { createOnceInitializer } = require('../src/lib/onceInit.cjs');
    let calls = 0;
    const ensure = createOnceInitializer(() => {
      calls += 1;
      return Promise.resolve('value');
    });
    const [a, b] = await Promise.all([ensure(), ensure()]);

    const probe = `
      let calls = 0;
      const ensure = mod.createOnceInitializer(() => {
        calls += 1;
        return Promise.resolve('value');
      });
      const [a, b] = await Promise.all([ensure(), ensure()]);
      return { calls, a, b };
    `;
    expect(runEsmProbe('src/lib/onceInit.js', probe)).toEqual({ calls, a, b });
  });

  test('badgeColors.js matches badgeColors.cjs', () => {
    const cjs = require('../src/lib/badgeColors.cjs');
    const probe = `
      return { BADGE_COLORS: mod.BADGE_COLORS, DEFAULT_BADGE_COLOR: mod.DEFAULT_BADGE_COLOR };
    `;
    expect(runEsmProbe('src/lib/badgeColors.js', probe)).toEqual({
      BADGE_COLORS: cjs.BADGE_COLORS,
      DEFAULT_BADGE_COLOR: cjs.DEFAULT_BADGE_COLOR,
    });
  });

  test('historyLogic.js matches historyLogic.cjs', () => {
    const { TabHistoryManager } = require('../src/lib/historyLogic.cjs');
    function buildSnapshot(Manager) {
      const manager = new Manager(3);
      manager.activateTab(1);
      manager.activateTab(2);
      manager.activateTab(3);
      manager.activateTab(4);
      manager.hydrate([9, 8, 7, 6]);
      return {
        history: manager.getHistory(),
        position8: manager.getPosition(8),
        positionMissing: manager.getPosition(999),
      };
    }

    const probe = `
      const manager = new mod.TabHistoryManager(3);
      manager.activateTab(1);
      manager.activateTab(2);
      manager.activateTab(3);
      manager.activateTab(4);
      manager.hydrate([9, 8, 7, 6]);
      return {
        history: manager.getHistory(),
        position8: manager.getPosition(8),
        positionMissing: manager.getPosition(999),
      };
    `;
    expect(runEsmProbe('src/lib/historyLogic.js', probe)).toEqual(buildSnapshot(TabHistoryManager));
  });

  test('badgeConfig.js (classic content script) matches badgeConfig.cjs', () => {
    const cjs = require('../src/lib/badgeConfig.cjs');
    const probe = `
      return {
        pos0: globalThis.TabFlowLib.getBadgeConfig(0),
        pos5: globalThis.TabFlowLib.getBadgeConfig(5),
        invalid: globalThis.TabFlowLib.getBadgeConfig(-1),
      };
    `;
    expect(runEsmProbe('src/lib/badgeConfig.js', probe)).toEqual({
      pos0: cjs.getBadgeConfig(0),
      pos5: cjs.getBadgeConfig(5),
      invalid: cjs.getBadgeConfig(-1),
    });
  });

  test('headObserver.js (classic content script) matches headObserver.cjs', () => {
    const { waitForHead } = require('../src/lib/headObserver.cjs');
    const cjsResults = [];
    waitForHead({ head: { id: 'fake-head' } }, (head) => cjsResults.push(head));

    const probe = `
      const results = [];
      globalThis.TabFlowLib.waitForHead({ head: { id: 'fake-head' } }, (head) => results.push(head));
      return results;
    `;
    expect(runEsmProbe('src/lib/headObserver.js', probe)).toEqual(cjsResults);
  });
});
