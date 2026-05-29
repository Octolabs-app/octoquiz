// After `next build` with STATIC_EXPORT=1, this script makes the static
// `out/` directory APK-ready by overwriting the root index.html with the
// couples page content. The previous redirect approach (out/index.html ->
// <meta refresh> to /couples/) failed inside Capacitor's WebView and showed
// a black screen, so we now serve the couples page directly at /.
//
// Asset paths inside the couples HTML are absolute (/_next/static/...),
// which the WebView resolves to https://localhost/_next/static/... — the
// same place Capacitor puts them. Works without any redirect step.

import { existsSync, statSync, copyFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'out')

if (!existsSync(outDir)) {
  console.error('✗ out/ directory not found.')
  process.exit(1)
}

const couplesIndex = join(outDir, 'couples', 'index.html')
if (!existsSync(couplesIndex)) {
  console.error('✗ out/couples/index.html not found.')
  process.exit(1)
}

const rootIndex = join(outDir, 'index.html')
copyFileSync(couplesIndex, rootIndex)

const sz = statSync(rootIndex).size
console.log('✓ APK static export ready')
console.log(`  • out/couples/index.html  (original)`)
console.log(`  • out/index.html          (couples content, ${(sz / 1024).toFixed(1)} KB)`)
console.log(`  • Both load the same page — Capacitor's WebView starts at /`)
