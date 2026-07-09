// faviconLink.js - loaded as a classic content script, exposes TabFlowLib.isFaviconRel
function isFaviconRel(relAttribute) {
  const tokens = (relAttribute || '').toLowerCase().split(/\s+/).filter(Boolean);
  // "alternate icon" (seen on GitHub) is an optional, non-default icon
  // variant — same as "alternate stylesheet" isn't the page's real
  // stylesheet. Browsers don't use it as the tab favicon, so neither do we.
  return tokens.includes('icon') && !tokens.includes('alternate');
}

globalThis.TabFlowLib = globalThis.TabFlowLib || {};
globalThis.TabFlowLib.isFaviconRel = isFaviconRel;
