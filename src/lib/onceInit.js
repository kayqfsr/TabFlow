// onceInit.js
/**
 * Wraps an async initialization function so that, no matter how many
 * times it's called (even concurrently), the actual work only happens
 * once. Subsequent calls reuse the same Promise.
 * @param {() => Promise<any>} initFn
 * @returns {() => Promise<any>}
 */
export function createOnceInitializer(initFn) {
  let initPromise = null;

  return function ensureInitialized() {
    if (!initPromise) {
      initPromise = initFn();
    }
    return initPromise;
  };
}
