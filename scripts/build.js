const esbuild = require('esbuild');
const { dtsPlugin } = require('esbuild-plugin-d.ts');
const fs = require('fs');
const path = require('path');

async function build() {
	// Remove the dist folder
	await fs.rmSync(path.join(__dirname, '../dist'), { recursive: true, force: true });

	// Bundle TypeScript to JavaScript
	await esbuild.build({
		entryPoints: ['src/index.ts'],
		bundle: true,
		outfile: 'dist/index.js',
		platform: 'node',
		plugins: [dtsPlugin()],
	});

	// Copy the contents of the pkg folder to dist
	const pkgDir = path.join(__dirname, '../pkg');
	const distDir = path.join(__dirname, '../dist');

	// Create the dist folder if it doesn't exist
	if (!fs.existsSync(distDir)) {
		fs.mkdirSync(distDir);
	}

	fs.readdirSync(pkgDir).forEach((file) => {
		if (file !== 'package.json') {
			fs.copyFileSync(path.join(pkgDir, file), path.join(distDir, file));
		}
	});
}

build().catch((e) => {
	console.error(e);
	process.exit(1);
});
