// positionRequest.js
export function resolvePositionResponse(historyManager, tabId) {
  return { position: historyManager.getPosition(tabId) };
}
