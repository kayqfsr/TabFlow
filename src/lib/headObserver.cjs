// headObserver.cjs - CommonJS wrapper for Jest tests
function waitForHead(doc, callback) {
  if (doc.head) {
    callback(doc.head);
    return;
  }

  if (!doc.documentElement) {
    doc.addEventListener('DOMContentLoaded', function handler() {
      doc.removeEventListener('DOMContentLoaded', handler);
      waitForHead(doc, callback);
    });
    return;
  }

  const rootObserver = new MutationObserver(function () {
    if (doc.head) {
      rootObserver.disconnect();
      callback(doc.head);
    }
  });

  rootObserver.observe(doc.documentElement, { childList: true });
}

module.exports = { waitForHead };
