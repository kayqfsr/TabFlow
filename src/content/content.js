// content.js - Script de conteúdo (Versão Corrigida Anti-Loop)

let originalFavicon = null;
let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');
let currentPosition = -1;
let faviconObserver = null;
let getBadgeConfig = null;

import(chrome.runtime.getURL('lib/badgeConfig.js')).then(function(module) {
  getBadgeConfig = module.getBadgeConfig;
  applyFaviconWithBadge();
});

// Inicializa
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFaviconObserver);
} else {
  initFaviconObserver();
}

function initFaviconObserver() {
  const head = document.head;
  if (!head) return;

  faviconObserver = new MutationObserver(function(mutations) {
    let shouldReapply = false;

    mutations.forEach(function(mutation) {
      // Verifica mudanças de atributos (href)
      if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
        const target = mutation.target;
        if (target.tagName === 'LINK' && (target.rel.includes('icon'))) {
          // PROTETOR CONTRA LOOP: Se o novo link for o nosso próprio badge, ignora!
          if (target.href.startsWith('data:image/png')) return;
          
          originalFavicon = target.href; // Atualiza o original se o site mudou
          shouldReapply = true;
        }
      }
      // Verifica adição de novos favicons pelo site
      else if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(function(node) {
          if (node.tagName === 'LINK' && (node.rel.includes('icon'))) {
             if (node.href.startsWith('data:image/png')) return; // Ignora o nosso
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
    attributeFilter: ['href']
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'updateHistory') {
    currentPosition = request.position;
    applyFaviconWithBadge();
  }
});

function applyFaviconWithBadge() {
  // Se estiver fora do histórico (-1), restaura
  if (currentPosition === -1) {
    restoreOriginalFavicon();
    return;
  }
  manipulateFaviconWithBadge(currentPosition);
}

function manipulateFaviconWithBadge(position) {
  if (!getBadgeConfig) return;

  const badge = getBadgeConfig(position);
  if (!badge) return;

  let faviconLink = document.querySelector('link[rel*="icon"]');

  // Cria se não existir
  if (!faviconLink) {
    faviconLink = document.createElement('link');
    faviconLink.rel = 'icon';
    document.head.appendChild(faviconLink);
  }

  // Salva o original apenas se não for o nosso badge
  if (!originalFavicon && !faviconLink.href.startsWith('data:')) {
    originalFavicon = faviconLink.href;
  }

  // Desenho do Badge
  canvas.width = 32; // Melhor resolução
  canvas.height = 32;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fundo Quadrado Arredondado
  ctx.fillStyle = badge.backgroundColor;
  ctx.beginPath();
  // roundRect é moderno, fallback para rect simples se der erro
  if (ctx.roundRect) {
      ctx.roundRect(0, 0, canvas.width, canvas.height, 8);
  } else {
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.fill();

  // Número
  ctx.fillStyle = badge.textColor;
  ctx.font = 'bold 20px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(badge.label, canvas.width / 2, canvas.height / 2 + 2);

  // Aplica sem disparar loop (graças ao check lá em cima)
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