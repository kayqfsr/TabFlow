// options.js - Script para a página de opções
// Carrega e salva as configurações do usuário com interface moderna

import { getSaveValidationError } from '../lib/optionsValidation.js';
import { BADGE_COLORS } from '../lib/badgeColors.js';

document.addEventListener('DOMContentLoaded', function() {
  const maxHistorySizeInput = document.getElementById('maxHistorySize');
  const rangeValue = document.getElementById('rangeValue');
  const currentValue = document.getElementById('currentValue');
  const saveButton = document.getElementById('saveButton');
  const successMessage = document.getElementById('successMessage');
  const errorMessage = document.getElementById('errorMessage');
  const errorMessageText = document.getElementById('errorMessageText');
  const badgePreview = document.getElementById('badgePreview');
  const totalTabsElement = document.getElementById('totalTabs');
  const trackedTabsElement = document.getElementById('trackedTabs');

  // Carrega as configurações atuais
  loadSettings();

  // Carrega estatísticas
  loadStats();

  // Atualiza preview quando o slider muda
  maxHistorySizeInput.addEventListener('input', function() {
    const value = parseInt(this.value);
    rangeValue.textContent = value;
    updateBadgePreview(value);
  });

  // Salva as configurações ao clicar no botão
  saveButton.addEventListener('click', saveSettings);

  // Funções auxiliares
  function loadSettings() {
    chrome.storage.sync.get(['maxHistorySize'], function(result) {
      const size = result.maxHistorySize || 5;
      maxHistorySizeInput.value = size;
      rangeValue.textContent = size;
      currentValue.textContent = size;
      updateBadgePreview(size);
    });
  }

  function saveSettings() {
    const maxHistorySize = parseInt(maxHistorySizeInput.value);
    const validationError = getSaveValidationError(maxHistorySize);

    if (validationError) {
      showError(validationError);
      return;
    }

    chrome.storage.sync.set({ maxHistorySize: maxHistorySize }, function() {
      // Notifica o background script para atualizar
      chrome.runtime.sendMessage({
        action: 'updateSettings',
        maxHistorySize: maxHistorySize
      });

      // Atualiza badge do header
      currentValue.textContent = maxHistorySize;

      // Mostra mensagem de sucesso
      showSuccess();

      // Recarrega estatísticas
      setTimeout(loadStats, 500);
    });
  }

  function updateBadgePreview(count) {
    badgePreview.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
      const badge = document.createElement('div');
      badge.className = 'preview-badge';
      badge.textContent = i + 1;
      
      // Define cor baseada na posição
      if (i === 0) {
        badge.style.backgroundColor = BADGE_COLORS[0];
      } else if (i === 1) {
        badge.style.backgroundColor = BADGE_COLORS[1];
      } else {
        badge.style.backgroundColor = BADGE_COLORS[2];
      }
      
      badgePreview.appendChild(badge);
    }
  }

  function showSuccess() {
    successMessage.classList.add('show');
    
    setTimeout(() => {
      successMessage.classList.remove('show');
    }, 3000);
  }

  function showError(message) {
    errorMessageText.textContent = message;
    errorMessage.classList.add('show');

    setTimeout(() => {
      errorMessage.classList.remove('show');
    }, 3000);
  }

  function loadStats() {
    // Obtém total de abas abertas
    chrome.tabs.query({}, function(tabs) {
      totalTabsElement.textContent = tabs.length;
    });

    // Obtém histórico atual
    chrome.runtime.sendMessage({ action: 'getHistory' }, function(response) {
      if (response && response.history) {
        trackedTabsElement.textContent = response.history.length;
      }
    });
  }
});
