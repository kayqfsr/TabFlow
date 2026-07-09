const manifest = require('../src/manifest.json');

const INTERNAL_SCHEMES = [
  'chrome://',
  'chrome-extension://',
  'edge://',
  'about:',
  'file://',
  'chrome.google.com/webstore',
];

function isBroadWildcard(pattern) {
  return pattern === '<all_urls>' || pattern === '*://*/*';
}

describe('manifest.json permissions', () => {
  test('permissions list only requests capabilities the extension actually uses', () => {
    expect(manifest.permissions.sort()).toEqual(['storage', 'tabs']);
  });

  test('host_permissions does not use the unrestricted <all_urls> wildcard', () => {
    expect(manifest.host_permissions.some(isBroadWildcard)).toBe(false);
  });

  test('host_permissions only targets http(s) origins', () => {
    manifest.host_permissions.forEach((pattern) => {
      expect(pattern).toMatch(/^https?:\/\//);
    });
  });

  test('content_scripts matches does not use the unrestricted <all_urls> wildcard', () => {
    manifest.content_scripts.forEach((script) => {
      expect(script.matches.some(isBroadWildcard)).toBe(false);
    });
  });

  test('content_scripts matches only targets http(s) origins', () => {
    manifest.content_scripts.forEach((script) => {
      script.matches.forEach((pattern) => {
        expect(pattern).toMatch(/^https?:\/\//);
      });
    });
  });

  test('permission patterns never cover internal browser schemes', () => {
    const allPatterns = [
      ...manifest.host_permissions,
      ...manifest.content_scripts.flatMap((script) => script.matches),
    ];

    allPatterns.forEach((pattern) => {
      INTERNAL_SCHEMES.forEach((scheme) => {
        expect(pattern.startsWith(scheme)).toBe(false);
      });
    });
  });
});
