// badgeConfig.cjs - CommonJS wrapper for Jest tests
const BADGE_COLORS = ['#FF4444', '#FF8800', '#FFFF00'];
const DEFAULT_BADGE_COLOR = '#CCCCCC';

function getBadgeConfig(position) {
  if (!Number.isInteger(position) || position < 0) {
    return null;
  }

  return {
    backgroundColor: BADGE_COLORS[position] || DEFAULT_BADGE_COLOR,
    textColor: position > 1 ? '#000000' : '#FFFFFF',
    label: String(position + 1),
  };
}

module.exports = { getBadgeConfig };
