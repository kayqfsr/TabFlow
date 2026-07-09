const { execFileSync } = require('child_process');
const path = require('path');
const { pathToFileURL } = require('url');

/**
 * Runs `probeBody` (an async function body with access to the ES module
 * under test as `mod`) in a real Node ESM context, via a subprocess, and
 * returns its JSON-serializable result. Needed because Jest here runs
 * test files as CommonJS and cannot `import()` native ES modules directly.
 * @param {string} jsRelativePath - path to the .js module, relative to the repo root
 * @param {string} probeBody - function body; must `return` a JSON-serializable value
 */
function runEsmProbe(jsRelativePath, probeBody) {
  const absPath = path.join(__dirname, '..', '..', jsRelativePath);
  const fileUrl = pathToFileURL(absPath).href;
  const script = [
    `import * as mod from '${fileUrl}';`,
    `(async () => { ${probeBody} })()`,
    `  .then((value) => { process.stdout.write(JSON.stringify(value === undefined ? null : value)); })`,
    `  .catch((error) => { process.stderr.write(String(error && error.stack || error)); process.exit(1); });`,
  ].join('\n');

  const output = execFileSync(process.execPath, ['--input-type=module', '-e', script], {
    encoding: 'utf8',
  });
  return JSON.parse(output);
}

module.exports = { runEsmProbe };
