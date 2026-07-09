// background.js
import { TabHistoryManager } from '../lib/historyLogic.js';
import { isSessionStorageAvailable } from '../lib/storageAvailability.js';

const historyManager = new TabHistoryManager(5);
const STORAGE_KEY = 'tabHistory';

// Flag para garantir que o histórico foi carregado antes de processar eventos
let isHistoryLoaded = false;

// Inicialização: carrega histórico salvo e configurações
(async function init() {
  await loadHistoryFromStorage();
  await loadSettings();
  isHistoryLoaded = true;
})();

chrome.runtime.onStartup.addListener(async () => {
  await loadHistoryFromStorage();
  await loadSettings();
});

chrome.runtime.onInstalled.addListener(async () => {
  await loadHistoryFromStorage();
  await loadSettings();
});

/**
 * Carrega o histórico salvo do chrome.storage.session
 */
async function loadHistoryFromStorage() {
  if (!isSessionStorageAvailable(chrome.storage)) {
    console.warn('[TabFlow] chrome.storage.session indisponível; histórico não será persistido entre reinícios do service worker.');
    return;
  }

  return new Promise((resolve) => {
    chrome.storage.session.get([STORAGE_KEY], function(result) {
      if (result[STORAGE_KEY]) {
        historyManager.hydrate(result[STORAGE_KEY]);
        console.log('[TabFlow] Histórico restaurado:', result[STORAGE_KEY]);
      }
      resolve();
    });
  });
}

/**
 * Salva o histórico atual no chrome.storage.session
 */
function saveHistoryToStorage() {
  if (!isSessionStorageAvailable(chrome.storage)) return;

  const history = historyManager.getHistory();
  chrome.storage.session.set({ [STORAGE_KEY]: history }, function() {
    if (chrome.runtime.lastError) {
      console.error('[TabFlow] Erro ao salvar histórico:', chrome.runtime.lastError);
    }
  });
}

async function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['maxHistorySize'], function(result) {
      const size = result.maxHistorySize || 5;
      historyManager.setMaxSize(size);
      resolve();
    });
  });
}

chrome.tabs.onActivated.addListener(async function(activeInfo) {
  // Aguarda histórico ser carregado antes de processar
  if (!isHistoryLoaded) {
    await loadHistoryFromStorage();
    isHistoryLoaded = true;
  }
  
  historyManager.activateTab(activeInfo.tabId);
  saveHistoryToStorage(); // Persiste o novo estado
  broadcastHistory();
});

function broadcastHistory() {
  chrome.tabs.query({}, function(tabs) {
    tabs.forEach(function(tab) {
      const position = historyManager.getPosition(tab.id);
      // catch ignora erros de abas que não carregaram ou são do sistema
      chrome.tabs.sendMessage(tab.id, {
        action: 'updateHistory',
        position: position
      }).catch(() => {}); 
    });
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'getHistory') {
    sendResponse({ history: historyManager.getHistory() });
  } else if (request.action === 'updateSettings') {
    historyManager.setMaxSize(request.maxHistorySize);
    chrome.storage.sync.set({ maxHistorySize: request.maxHistorySize });
    saveHistoryToStorage(); // Salva histórico ajustado ao novo tamanho
    broadcastHistory();
  }
});

// Limpa histórico quando abas são fechadas (opcional, mas recomendado)
chrome.tabs.onRemoved.addListener(function(tabId) {
  const history = historyManager.getHistory();
  if (history.includes(tabId)) {
    // Remove a aba fechada do histórico
    historyManager.hydrate(history.filter(id => id !== tabId));
    saveHistoryToStorage();
    broadcastHistory();
  }
});