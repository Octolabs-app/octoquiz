// After `next build` with STATIC_EXPORT=1, this script:
//   1. Replaces out/index.html with a tiny redirect to /couples/
//      (the Yomu landing page would try to open Socket.IO — useless in the APK).
//   2. Logs a small summary.

import { writeFileSync, existsSync, statSync } from 'node:fs'
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

const redirectHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta http-equiv="refresh" content="0; url=./couples/">
  <title>After Dark</title>
  <style>
    html, body { margin: 0; height: 100%; background: #0a0a14; color: #fff;
      font-family: system-ui, sans-serif; display: flex; align-items: center;
      justify-content: center; }
  </style>
</head>
<body>
  <script>location.replace('./couples/')</script>
  <noscript><a href="./couples/" style="color:#fff">Open After Dark</a></noscript>
</body>
</html>
`

writeFileSync(join(outDir, 'index.html'), redirectHtml)

const sz = statSync(couplesIndex).size
console.log('✓ APK static export ready')
console.log(`  • out/couples/index.html  (${(sz / 1024).toFixed(1)} KB)`)
console.log('  • out/index.html → redirect → /couples/')
