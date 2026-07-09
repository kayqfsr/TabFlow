// onceInit.cjs - CommonJS wrapper for Jest tests
function createOnceInitializer(initFn) {
  let initPromise = null;

  return function ensureInitialized() {
    if (!initPromise) {
      initPromise = initFn();
    }
    return initPromise;
  };
}

module.exports = { createOnceInitializer };
