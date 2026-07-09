// content.js - Content script

let originalFavicon = null;
let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');
let currentPosition = -1;
let faviconObserver = null;
// Aliased (not just "getBadgeConfig") because badgeConfig.js's own top-level
// `function getBadgeConfig` declaration shares this same content-script
// global scope — redeclaring the name here would throw a SyntaxError.
const readBadgeConfig = globalThis.TabFlowLib.getBadgeConfig;

globalThis.TabFlowLib.waitForHead(document, initFaviconObserver);

requestCurrentPosition();

function requestCurrentPosition() {
  chrome.runtime.sendMessage({ action: 'getPosition' }, function (response) {
    if (chrome.runtime.lastError) return;
    if (response && typeof response.position === 'number') {
      currentPosition = response.position;
      applyFaviconWithBadge();
    }
  });
}

function initFaviconObserver(head) {
  faviconObserver = new MutationObserver(function (mutations) {
    let shouldReapply = false;

    mutations.forEach(function (mutation) {
      // Check for attribute changes (href)
      if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
        const target = mutation.target;
        if (target.tagName === 'LINK' && target.rel.includes('icon')) {
          // Ignore mutations caused by our own badge to avoid a redraw loop
          if (target.href.startsWith('data:image/png')) return;

          originalFavicon = target.href; // Update the original if the site changed it
          shouldReapply = true;
        }
      }
      // Check for new favicons added by the site
      else if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(function (node) {
          if (node.tagName === 'LINK' && node.rel.includes('icon')) {
            if (node.href.startsWith('data:image/png')) return; // Ignore our own
            shouldReapply = true;
          }
        });
      }
    });

    if (shouldReapply) {
      applyFaviconWithBadge();
    }
  });

  faviconObserver.observe(head, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['href'],
  });
}

chrome.runtime.onMessage.addListener(function (request) {
  if (request.action === 'updateHistory') {
    currentPosition = request.position;
    applyFaviconWithBadge();
  }
});

function applyFaviconWithBadge() {
  // If outside history (-1), restore
  if (currentPosition === -1) {
    restoreOriginalFavicon();
    return;
  }
  manipulateFaviconWithBadge(currentPosition);
}

function manipulateFaviconWithBadge(position) {
  if (!readBadgeConfig) return;

  const badge = readBadgeConfig(position);
  if (!badge) return;

  let faviconLink = document.querySelector('link[rel*="icon"]');

  // Create it if it doesn't exist
  if (!faviconLink) {
    faviconLink = document.createElement('link');
    faviconLink.rel = 'icon';
    document.head.appendChild(faviconLink);
  }

  // Only save the original if it isn't our own badge
  if (!originalFavicon && !faviconLink.href.startsWith('data:')) {
    originalFavicon = faviconLink.href;
  }

  // Draw the badge
  canvas.width = 32; // Higher resolution
  canvas.height = 32;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Rounded square background
  ctx.fillStyle = badge.backgroundColor;
  ctx.beginPath();
  // roundRect is modern; fall back to a plain rect if unsupported
  if (ctx.roundRect) {
    ctx.roundRect(0, 0, canvas.width, canvas.height, 8);
  } else {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.fill();

  // Number
  ctx.fillStyle = badge.textColor;
  ctx.font = 'bold 20px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(badge.label, canvas.width / 2, canvas.height / 2 + 2);

  // Apply without triggering a loop (thanks to the check above)
  faviconLink.href = canvas.toDataURL('image/png');
}

function restoreOriginalFavicon() {
  if (originalFavicon) {
    const faviconLink = document.querySelector('link[rel*="icon"]');
    if (faviconLink && faviconLink.href !== originalFavicon) {
      faviconLink.href = originalFavicon;
    }
  }
}
