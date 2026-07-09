const { isFaviconRel } = require('../src/lib/faviconLink.cjs');

describe('isFaviconRel', () => {
  test('matches the standard favicon rel', () => {
    expect(isFaviconRel('icon')).toBe(true);
  });

  test('matches the legacy shortcut icon rel', () => {
    expect(isFaviconRel('shortcut icon')).toBe(true);
  });

  test('matches regardless of case or surrounding whitespace', () => {
    expect(isFaviconRel('  ICON  ')).toBe(true);
    expect(isFaviconRel('Shortcut Icon')).toBe(true);
  });

  test('does not match rels that merely contain "icon" as a substring', () => {
    // These are real values seen on GitHub, Wikipedia, and Apple's spec —
    // matching them by substring picks the wrong <link>, since browsers
    // don't use them as the tab favicon.
    expect(isFaviconRel('apple-touch-icon')).toBe(false);
    expect(isFaviconRel('fluid-icon')).toBe(false);
    expect(isFaviconRel('mask-icon')).toBe(false);
  });

  test('does not match unrelated rels', () => {
    expect(isFaviconRel('stylesheet')).toBe(false);
    expect(isFaviconRel('alternate')).toBe(false);
  });

  test('does not match "alternate icon" (GitHub), a non-default icon variant browsers ignore for the tab favicon', () => {
    expect(isFaviconRel('alternate icon')).toBe(false);
  });

  test('handles missing/empty input without throwing', () => {
    expect(isFaviconRel(null)).toBe(false);
    expect(isFaviconRel(undefined)).toBe(false);
    expect(isFaviconRel('')).toBe(false);
  });
});
