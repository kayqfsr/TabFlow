const { getBadgeConfig } = require('../src/lib/badgeConfig.cjs');

describe('getBadgeConfig', () => {
  test('returns a config for a valid position', () => {
    const config = getBadgeConfig(0);
    expect(config).toEqual({
      backgroundColor: '#FF4444',
      textColor: '#FFFFFF',
      label: '1',
    });
  });

  test('maps each tracked position to its own color', () => {
    expect(getBadgeConfig(0).backgroundColor).toBe('#FF4444');
    expect(getBadgeConfig(1).backgroundColor).toBe('#FF8800');
    expect(getBadgeConfig(2).backgroundColor).toBe('#FFFF00');
  });

  test('falls back to a neutral color beyond the tracked positions', () => {
    expect(getBadgeConfig(5).backgroundColor).toBe('#CCCCCC');
  });

  test('uses dark text once the background is light enough', () => {
    expect(getBadgeConfig(2).textColor).toBe('#000000');
  });

  test('label only ever contains the 1-based position digits, nothing else', () => {
    for (let position = 0; position < 20; position += 1) {
      expect(getBadgeConfig(position).label).toMatch(/^\d+$/);
      expect(getBadgeConfig(position).label).toBe(String(position + 1));
    }
  });

  test('returns null for invalid (non-history) positions instead of leaking arbitrary input', () => {
    expect(getBadgeConfig(-1)).toBeNull();
    expect(getBadgeConfig(1.5)).toBeNull();
    expect(getBadgeConfig('1')).toBeNull();
    expect(getBadgeConfig(undefined)).toBeNull();
  });

  test('accepts only a numeric position, so no other tab data (url, title, domain) can reach the favicon badge', () => {
    expect(getBadgeConfig.length).toBe(1);
  });

  test('the badge config never carries any field beyond backgroundColor, textColor, and label', () => {
    const config = getBadgeConfig(2);
    expect(Object.keys(config).sort()).toEqual(['backgroundColor', 'label', 'textColor']);
  });
});
