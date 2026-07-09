const fs = require('fs');
const path = require('path');

const backgroundSource = fs.readFileSync(
  path.join(__dirname, '../src/background/background.js'),
  'utf8'
);

describe('external messaging surface', () => {
  test('background script does not register an onMessageExternal handler', () => {
    // Accepting messages from other extensions bypasses the sender-id check
    // that isTrustedSender() enforces for onMessage; any addition here needs
    // a deliberate security review, not an accidental copy-paste.
    expect(backgroundSource).not.toMatch(/onMessageExternal/);
  });
});
