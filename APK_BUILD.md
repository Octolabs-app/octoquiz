# After Dark — Android APK build guide

The **After Dark** couples mode (`/couples`) ships as a **fully offline
standalone Android app**. It does not need the Socket.IO server — everything
runs locally on the phone.

The main Yomu Game Night multiplayer build (TV + phones over Socket.IO) is
unaffected and still uses `npm run dev` exactly as before.

---

## One-time setup on your machine

You need:

- **Node 20+**
- **Android Studio** with the Android SDK installed
  (Studio handles `adb`, `gradle`, build-tools, and the emulator)
- **Java 17+** (Android Studio ships its own JDK — set `JAVA_HOME` if needed)

Install the new packages added to `package.json`:

```bash
npm install
```

This pulls in `@capacitor/core`, `@capacitor/android`, `@capacitor/cli`, plus
`cross-env` for the env-gated build.

---

## Build the APK

### 1. Produce the static export

```bash
npm run apk:export
```

What this does:

1. Runs `next build` with `STATIC_EXPORT=1`, which flips `next.config.mjs` into
   `output: 'export'` mode and produces an `out/` directory containing all the
   client-side React for `/couples`.
2. Runs `scripts/post-export-apk.mjs`, which rewrites `out/index.html` to a
   tiny `<meta refresh>` redirect pointing at `out/couples/`. The Yomu lobby
   pages would try to open a Socket.IO connection — useless inside the APK,
   so we skip straight to the offline couples mode.

### 2. Add the Android platform (only the first time)

```bash
npm run apk:init
```

This runs `npx cap add android`, which scaffolds an `android/` Gradle project
inside the repo. Commit this directory if you want reproducible builds.

### 3. Sync the web assets into the Android project

```bash
npm run apk:sync
```

Internally: `apk:export` + `npx cap sync android`. Run this every time you
change anything under `app/couples/`, `data/after-dark*.ts`, or the global
styles that After Dark uses.

### 4. Open in Android Studio (recommended for first build)

```bash
npm run apk:open
```

Then:

- **Build → Generate Signed App Bundle / APK** for a release APK.
- **Run** ▶ on the emulator or a USB-connected device for a debug build.

### 4b. Or build a debug APK from the CLI

```bash
npm run apk:build
```

Runs `apk:sync` and then `./gradlew assembleDebug` inside `android/`. The
output APK appears at:

```
android/app/build/outputs/apk/debug/app-debug.apk
```

Side-load this onto any Android 7+ device (`adb install` or transfer + tap).

---

## Capacitor config (`capacitor.config.ts`)

| Key | Value | Why |
| --- | --- | --- |
| `appId` | `com.yomu.afterdark` | unique Android package id |
| `appName` | After Dark | label under the launcher icon |
| `webDir` | `out` | output of `next export` |
| `androidScheme` | `https` | required for several modern web APIs |
| `backgroundColor` | `#0a0a14` | matches the After Dark night theme |

If you change `appId` after a release, the Play Store will treat it as a new
app — only do it on the very first build.

---

## Branding the launcher icon & splash

1. Drop a 1024×1024 PNG at `resources/icon.png`.
2. Drop a 2732×2732 PNG at `resources/splash.png`.
3. Run `npx @capacitor/assets generate --android` (one-time install:
   `npm i -D @capacitor/assets`).

---

## Releasing to the Play Store

1. Bump `versionCode` and `versionName` in
   `android/app/build.gradle`.
2. `npm run apk:sync`.
3. In Android Studio: **Build → Generate Signed App Bundle**, sign with your
   release keystore, upload the resulting `.aab` to Play Console.

---

## Troubleshooting

- **"out/couples/index.html not found"** — the static export crashed. Look
  for errors in `next build`'s output. The most common cause is a `'use server'`
  import being pulled into a client component; remove it.
- **APK opens to a blank black screen** — open Chrome DevTools, attach to the
  running app via `chrome://inspect`, and check the console. Usually a stale
  reference to a Socket.IO connect attempt, or an absolute asset path.
- **Sound doesn't play** — Web Audio inside Capacitor needs a user gesture
  before resume. After Dark already calls `play()` on tap, so this should be
  fine; if not, check `useSound.ts`.
- **Haptics feel weak** — use the `@capacitor/haptics` native plugin in
  addition to `navigator.vibrate`. Already in the deps; swap inside
  `hooks/useHaptic.ts` if you want native feedback.
