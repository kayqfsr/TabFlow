// positionRequest.cjs - CommonJS wrapper for Jest tests
function resolvePositionResponse(historyManager, tabId) {
  return { position: historyManager.getPosition(tabId) };
}

module.exports = { resolvePositionResponse };
