// headObserver.js - loaded as a classic content script, exposes TabFlowLib.waitForHead
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

  const rootObserver = new MutationObserver(function() {
    if (doc.head) {
      rootObserver.disconnect();
      callback(doc.head);
    }
  });

  rootObserver.observe(doc.documentElement, { childList: true });
}

globalThis.TabFlowLib = globalThis.TabFlowLib || {};
globalThis.TabFlowLib.waitForHead = waitForHead;
