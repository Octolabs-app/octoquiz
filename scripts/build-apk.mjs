// Build pipeline for the standalone After Dark APK.
//
// The yomu multiplayer app has dynamic routes (/host/[room], /join/[room])
// that depend on the Socket.IO server. Those can't be statically exported,
// and they're useless inside the offline APK anyway.
//
// Strategy: temporarily move them to a hidden directory, run `next build`
// with STATIC_EXPORT=1, then move them back. The APK ships only /couples
// plus the / redirect that bounces straight into it.

import { existsSync, renameSync, rmSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const appDir = join(root, 'app')
const stash = join(root, '.apk-stash')

const ROUTES_TO_HIDE = ['host', 'join']

function move(src, dst) {
  if (existsSync(src)) renameSync(src, dst)
}

function hideRoutes() {
  mkdirSync(stash, { recursive: true })   // works with spaces in path
  for (const r of ROUTES_TO_HIDE) {
    move(join(appDir, r), join(stash, r))
  }
}

function restoreRoutes() {
  for (const r of ROUTES_TO_HIDE) {
    move(join(stash, r), join(appDir, r))
  }
  if (existsSync(stash)) {
    rmSync(stash, { recursive: true, force: true })
  }
}

// Wrap in try/finally so the routes are ALWAYS restored even if build fails.
console.log('▶ Hiding multiplayer routes for static export…')
hideRoutes()

try {
  // Also nuke .next/ so the dev server's build artifacts don't leak in.
  rmSync(join(root, '.next'), { recursive: true, force: true })

  console.log('▶ Running next build (STATIC_EXPORT=1)…')
  const build = spawnSync('npx', ['next', 'build'], {
    cwd: root,
    shell: true,
    stdio: 'inherit',
    env: { ...process.env, STATIC_EXPORT: '1' },
  })
  if (build.status !== 0) {
    throw new Error(`next build failed with status ${build.status}`)
  }

  console.log('▶ Running post-export script…')
  const post = spawnSync('node', [join('scripts', 'post-export-apk.mjs')], {
    cwd: root,
    shell: true,
    stdio: 'inherit',
  })
  if (post.status !== 0) {
    throw new Error(`post-export failed with status ${post.status}`)
  }

  console.log('✓ APK static export complete.')
} finally {
  console.log('▶ Restoring multiplayer routes…')
  restoreRoutes()
}
