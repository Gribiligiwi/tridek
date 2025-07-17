import { build } from 'esbuild'
import { minify } from 'html-minifier-terser'
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'fs'

mkdirSync('dist', { recursive: true })

// Bundle et minifie le JS
await build({
	entryPoints: ['src/app.js'],
	bundle: true,
	minify: true,
	format: 'iife',
	sourcemap: false,
	outfile: 'dist/bundle.js'
})

// Lis et minifie le HTML
const html = readFileSync('src/index.html', 'utf8')
const minified = await minify(html, {
	collapseWhitespace: true,
	removeComments: true,
	minifyJS: true,
	minifyCSS: true
})

// Injecte le script minifié dans le HTML
const final = minified.replace(
	'</body>',
	`<script src="bundle.js"></script></body>`
)

writeFileSync('dist/index.html', final)
copyFileSync('src/style.css', 'dist/style.css')
copyFileSync('src/favicon.svg', 'dist/favicon.svg')
copyFileSync('src/bell.mp3', 'dist/bell.mp3')