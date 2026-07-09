const fs = require('fs');
const path = require('path');
const optionsValidation = require('../src/lib/optionsValidation.cjs');
const messageValidation = require('../src/lib/messageValidation.cjs');
const { BADGE_COLORS: canonicalColors } = require('../src/lib/badgeColors.cjs');

describe('history size bounds single source of truth', () => {
  test('optionsValidation reuses the same bounds messageValidation enforces', () => {
    expect(optionsValidation.MIN_HISTORY_SIZE).toBe(messageValidation.MIN_HISTORY_SIZE);
    expect(optionsValidation.MAX_HISTORY_SIZE).toBe(messageValidation.MAX_HISTORY_SIZE);
  });
});

describe('badge color single source of truth', () => {
  test('options.js does not redefine its own BADGE_COLORS literal', () => {
    const optionsSource = fs.readFileSync(
      path.join(__dirname, '../src/options/options.js'),
      'utf8'
    );
    expect(optionsSource).not.toMatch(/const BADGE_COLORS\s*=/);
  });

  test('badgeConfig.js (classic content script, cannot import) stays byte-in-sync with the canonical palette', () => {
    const badgeConfigSource = fs.readFileSync(
      path.join(__dirname, '../src/lib/badgeConfig.js'),
      'utf8'
    );
    const match = badgeConfigSource.match(/const BADGE_COLORS = (\[[^\]]*\]);/);
    expect(match).not.toBeNull();

    const inlineColors = new Function(`return ${match[1]};`)();
    expect(inlineColors).toEqual(canonicalColors);
  });
});
