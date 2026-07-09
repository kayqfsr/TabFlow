const fs = require('fs');
const path = require('path');
const vm = require('vm');
const manifest = require('../src/manifest.json');

describe('content script shared global scope', () => {
  test('files listed together in manifest content_scripts.js do not redeclare the same top-level identifier', () => {
    // Chrome injects every file in one content_scripts.js array into the SAME
    // execution context, in order — effectively as if they were concatenated
    // classic <script> tags. Two files each declaring a top-level `const`/
    // `function` with the same name throws a real SyntaxError in the browser
    // and silently breaks every content script after the collision. Per-file
    // unit tests can't catch this since they never share a scope; compiling
    // the real files concatenated, in manifest order, reproduces the same
    // parse-time check the browser performs.
    manifest.content_scripts.forEach((script) => {
      const concatenatedSource = script.js
        .map((relativePath) =>
          fs.readFileSync(path.join(__dirname, '../src', relativePath), 'utf8')
        )
        .join('\n;\n');

      expect(() => new vm.Script(concatenatedSource)).not.toThrow();
    });
  });
});
