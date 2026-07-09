const { createOnceInitializer } = require('../src/lib/onceInit.cjs');

describe('createOnceInitializer', () => {
  test('invokes the wrapped function only once across concurrent callers', async () => {
    let resolveInit;
    const initFn = jest.fn(
      () =>
        new Promise((resolve) => {
          resolveInit = resolve;
        })
    );
    const ensureInitialized = createOnceInitializer(initFn);

    const first = ensureInitialized();
    const second = ensureInitialized();

    expect(initFn).toHaveBeenCalledTimes(1);

    resolveInit('done');
    await Promise.all([first, second]);

    expect(initFn).toHaveBeenCalledTimes(1);
  });

  test('all callers resolve with the same value', async () => {
    const ensureInitialized = createOnceInitializer(() => Promise.resolve('value'));

    const [a, b] = await Promise.all([ensureInitialized(), ensureInitialized()]);

    expect(a).toBe('value');
    expect(b).toBe('value');
  });

  test('calling after the wrapped promise already resolved still returns it without re-invoking', async () => {
    const initFn = jest.fn(() => Promise.resolve('value'));
    const ensureInitialized = createOnceInitializer(initFn);

    await ensureInitialized();
    await ensureInitialized();

    expect(initFn).toHaveBeenCalledTimes(1);
  });
});
