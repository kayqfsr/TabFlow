// faviconLink.cjs - CommonJS wrapper for Jest tests
function isFaviconRel(relAttribute) {
  const tokens = (relAttribute || '').toLowerCase().split(/\s+/).filter(Boolean);
  // "alternate icon" (seen on GitHub) is an optional, non-default icon
  // variant — same as "alternate stylesheet" isn't the page's real
  // stylesheet. Browsers don't use it as the tab favicon, so neither do we.
  return tokens.includes('icon') && !tokens.includes('alternate');
}

module.exports = { isFaviconRel };
