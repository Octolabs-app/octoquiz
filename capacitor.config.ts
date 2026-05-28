// After Dark — standalone Android APK.
// The /couples route is fully offline (no Socket.IO), so it ships as a
// static Next.js export under out/ and Capacitor wraps it as an Android app.
//
// Type comes from @capacitor/cli once installed (npm install).

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const config: any = {
  appId: 'com.yomu.afterdark',
  appName: 'After Dark',
  webDir: 'out',
  android: {
    allowMixedContent: false,
    backgroundColor: '#0a0a14',
  },
  server: {
    androidScheme: 'https',
    // Auto-redirect to the couples page on launch.
    // (Set by post-export-apk.mjs which rewrites out/index.html.)
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 800,
      backgroundColor: '#0a0a14',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0a0a14',
      overlaysWebView: false,
    },
  },
}

export default config
