// background.js
import { TabHistoryManager } from '../lib/historyLogic.js';
import { isValidMaxHistorySize, isTrustedSender } from '../lib/messageValidation.js';
import { isExpectedSendMessageError, getBroadcastTargetTabIds } from '../lib/tabMessaging.js';
import { isSessionStorageAvailable } from '../lib/storageAvailability.js';
import { resolvePositionResponse } from '../lib/positionRequest.js';
import { createOnceInitializer } from '../lib/onceInit.js';

const historyManager = new TabHistoryManager(5);
const STORAGE_KEY = 'tabHistory';

// Tab IDs notified in the last broadcast, so we know which ones need to
// be cleared (position -1) when they leave the tracked history
let lastBroadcastTabIds = [];

// Ensures history is only loaded once, even if onActivated fires before
// initialization finishes
const ensureHistoryLoaded = createOnceInitializer(loadHistoryFromStorage);

// Initialization: load saved history and settings
(async function init() {
  await ensureHistoryLoaded();
  await loadSettings();
})();

chrome.runtime.onStartup.addListener(async () => {
  await ensureHistoryLoaded();
  await loadSettings();
});

chrome.runtime.onInstalled.addListener(async () => {
  await ensureHistoryLoaded();
  await loadSettings();
});

/**
 * Loads the saved history from chrome.storage.session
 */
async function loadHistoryFromStorage() {
  if (!isSessionStorageAvailable(chrome.storage)) {
    console.warn(
      '[TabFlow] chrome.storage.session unavailable; history will not persist across service worker restarts.'
    );
    return;
  }

  return new Promise((resolve) => {
    chrome.storage.session.get([STORAGE_KEY], function (result) {
      if (result[STORAGE_KEY]) {
        historyManager.hydrate(result[STORAGE_KEY]);
        console.log('[TabFlow] History restored:', result[STORAGE_KEY]);
      }
      resolve();
    });
  });
}

/**
 * Saves the current history to chrome.storage.session
 */
function saveHistoryToStorage() {
  if (!isSessionStorageAvailable(chrome.storage)) return;

  const history = historyManager.getHistory();
  chrome.storage.session.set({ [STORAGE_KEY]: history }, function () {
    if (chrome.runtime.lastError) {
      console.error('[TabFlow] Error saving history:', chrome.runtime.lastError);
    }
  });
}

async function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['maxHistorySize'], function (result) {
      const size = result.maxHistorySize || 5;
      historyManager.setMaxSize(size);
      resolve();
    });
  });
}

chrome.tabs.onActivated.addListener(async function (activeInfo) {
  // Wait for history to load before processing
  await ensureHistoryLoaded();

  historyManager.activateTab(activeInfo.tabId);
  saveHistoryToStorage(); // Persist the new state
  broadcastHistory();
});

function broadcastHistory() {
  const currentTabIds = historyManager.getHistory();
  const targetTabIds = getBroadcastTargetTabIds(lastBroadcastTabIds, currentTabIds);

  targetTabIds.forEach(function (tabId) {
    const position = historyManager.getPosition(tabId);
    chrome.tabs
      .sendMessage(tabId, {
        action: 'updateHistory',
        position: position,
      })
      .catch((error) => {
        if (!isExpectedSendMessageError(error)) {
          console.error('[TabFlow] Error notifying tab', tabId, error);
        }
      });
  });

  lastBroadcastTabIds = currentTabIds;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (!isTrustedSender(sender, chrome.runtime.id)) {
    return;
  }

  if (request.action === 'getHistory') {
    sendResponse({ history: historyManager.getHistory() });
  } else if (request.action === 'getPosition') {
    if (sender.tab) {
      sendResponse(resolvePositionResponse(historyManager, sender.tab.id));
    }
  } else if (request.action === 'updateSettings') {
    if (!isValidMaxHistorySize(request.maxHistorySize)) {
      return;
    }
    historyManager.setMaxSize(request.maxHistorySize);
    chrome.storage.sync.set({ maxHistorySize: request.maxHistorySize });
    saveHistoryToStorage(); // Save history trimmed to the new size
    broadcastHistory();
  }
});

// Clear history when tabs are closed (optional, but recommended)
chrome.tabs.onRemoved.addListener(function (tabId) {
  const history = historyManager.getHistory();
  if (history.includes(tabId)) {
    // Remove the closed tab from history
    historyManager.hydrate(history.filter((id) => id !== tabId));
    saveHistoryToStorage();
    broadcastHistory();
  }
});
