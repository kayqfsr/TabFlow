// storageAvailability.js
export function isSessionStorageAvailable(storage) {
  return Boolean(storage && storage.session);
}
