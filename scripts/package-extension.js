// Packages src/ into a Chrome Web Store-ready zip at dist/TabFlow-v<version>.zip
import { createWriteStream, mkdirSync } from 'fs';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import archiver from 'archiver';

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const srcDir = path.join(rootDir, 'src');
const distDir = path.join(rootDir, 'dist');

const manifest = JSON.parse(readFileSync(path.join(srcDir, 'manifest.json'), 'utf8'));
const outputPath = path.join(distDir, `TabFlow-v${manifest.version}.zip`);

mkdirSync(distDir, { recursive: true });

const output = createWriteStream(outputPath);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`Created ${outputPath} (${archive.pointer()} bytes)`);
});

archive.on('warning', (err) => {
  throw err;
});
archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);
// .cjs files only exist for the Jest test suite; the manifest never
// references them, so they'd be dead weight in the shipped package.
archive.glob('**/*', { cwd: srcDir, ignore: ['**/*.cjs'] });
archive.finalize();
