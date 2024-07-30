import esbuild from 'esbuild';
import { dtsPlugin } from 'esbuild-plugin-d.ts';
import fs from 'fs';
import path from 'path';
import binaryen from 'binaryen';
import { fileURLToPath } from 'url';

// Current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function build() {
  // Remove the dist folder
  await fs.promises.rm(path.join(__dirname, '../dist'), { recursive: true, force: true });

  // Bundle TypeScript to JavaScript
  await esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    outfile: 'dist/index.js',
    platform: 'node',
    format: 'esm',
    plugins: [dtsPlugin()],
  });

  // Copy the contents of the pkg folder to dist
  const pkgDir = path.join(__dirname, '../pkg');
  const distDir = path.join(__dirname, '../dist');

  // Create the dist folder if it doesn't exist
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
  }

  const files = await fs.promises.readdir(pkgDir);
  for (const file of files) {
    if (file !== 'package.json' && file !== '.gitignore') {
      await fs.promises.copyFile(path.join(pkgDir, file), path.join(distDir, file));
    }
  }

  // Optimize .wasm file
  const wasmFile = path.join(distDir, 'svg_converter_wasm_bg.wasm');
  const wasmData = await fs.promises.readFile(wasmFile);
  const wasmModule = binaryen.readBinary(wasmData);
  wasmModule.optimize();
  const optimizedWasmData = wasmModule.emitBinary();
  await fs.promises.writeFile(wasmFile, Buffer.from(optimizedWasmData));

  console.log('Build completed successfully');
}

build().catch((e) => {
  console.error(e);
  process.exit(1);
});
