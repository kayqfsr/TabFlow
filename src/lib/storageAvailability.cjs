// storageAvailability.cjs - CommonJS wrapper for Jest tests
function isSessionStorageAvailable(storage) {
  return Boolean(storage && storage.session);
}

module.exports = { isSessionStorageAvailable };
