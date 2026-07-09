// options.js - Options page script
// Loads and saves user settings for the modern UI

import { getSaveValidationError } from '../lib/optionsValidation.js';
import { BADGE_COLORS } from '../lib/badgeColors.js';

document.addEventListener('DOMContentLoaded', function () {
  const maxHistorySizeInput = document.getElementById('maxHistorySize');
  const rangeValue = document.getElementById('rangeValue');
  const currentValue = document.getElementById('currentValue');
  const saveButton = document.getElementById('saveButton');
  const successMessage = document.getElementById('successMessage');
  const errorMessage = document.getElementById('errorMessage');
  const errorMessageText = document.getElementById('errorMessageText');
  const badgePreview = document.getElementById('badgePreview');

  // Load current settings
  loadSettings();

  // Update preview when the slider changes
  maxHistorySizeInput.addEventListener('input', function () {
    const value = parseInt(this.value);
    rangeValue.textContent = value;
    updateBadgePreview(value);
  });

  // Save settings when the button is clicked
  saveButton.addEventListener('click', saveSettings);

  // Helper functions
  function loadSettings() {
    chrome.storage.sync.get(['maxHistorySize'], function (result) {
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

    chrome.storage.sync.set({ maxHistorySize: maxHistorySize }, function () {
      // Notify the background script to update
      chrome.runtime.sendMessage({
        action: 'updateSettings',
        maxHistorySize: maxHistorySize,
      });

      // Update the header badge
      currentValue.textContent = maxHistorySize;

      // Show success message
      showSuccess();
    });
  }

  function updateBadgePreview(count) {
    badgePreview.innerHTML = '';

    for (let i = 0; i < count; i++) {
      const badge = document.createElement('div');
      badge.className = 'preview-badge';
      badge.textContent = i + 1;

      // Set color based on position
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
});
