# Building the native apps

The portfolio ships as a real Android and iOS app, not just a website. The
native projects live in `android/` and `ios/` and wrap the exported site with
[Capacitor](https://capacitorjs.com): the web assets are **bundled into the
app binary**, so nothing is fetched at launch and the whole experience — the
WebGL background, the scored loader, the neon contact screen — runs offline
from first run.

Everything is configured and committed. What is left is compiling, which
needs an Android SDK or Xcode on your machine.

## One rule that matters

Always build the web assets with `npm run app:build`, never a plain
`npm run build`.

The GitHub Pages build prefixes every asset with `/shrenik-portfolio`. That
path does not exist inside the app's webview, so a Pages build produces a
**blank screen** in the app. `app:build` clears `NEXT_PUBLIC_BASE_PATH` for
exactly this reason. `npm run app:sync` runs it for you.

## Android

Needs [Android Studio](https://developer.android.com/studio) (which brings the
SDK) and JDK 21.

```bash
npm run app:android      # builds the web assets, syncs, opens Android Studio
```

Then in Android Studio press **Run** for a device or emulator, or
**Build → Build Bundle(s) / APK(s) → Build APK(s)** for a file you can
sideload.

From the command line instead, once the SDK is installed:

```bash
npm run app:sync
cd android && ./gradlew assembleDebug
# → android/app/build/outputs/apk/debug/app-debug.apk
```

For the Play Store you need a release build signed with your own upload key
(`./gradlew bundleRelease` after configuring signing in
`android/app/build.gradle`), plus a Play Console account (one-off 25 USD).

## iOS

Needs a **Mac** with Xcode. There is no way around this — Apple does not
permit building or signing iOS apps on other platforms.

```bash
npm run app:ios          # builds the web assets, syncs, opens Xcode
```

In Xcode set your signing team under **Signing & Capabilities**, then Run.
Distribution needs an Apple Developer account (99 USD/year).

### Read this before submitting to the App Store

Apple's [guideline 4.2](https://developer.apple.com/app-store/review/guidelines/#minimum-functionality)
rejects apps that are essentially a wrapped website, and a portfolio is the
textbook case. Android and sideloading are unaffected, and TestFlight builds
you share directly are fine. If you do want it in the App Store, it needs
something a browser cannot do — offline-first content, share extensions,
notifications — argued clearly in the review notes.

## What the app is configured with

| | |
|---|---|
| App ID | `in.shrenikyd.portfolio` |
| Display name | `Shrenik.YD` |
| Icon / splash source | `assets/icon.png`, `assets/splash.png` |
| Web assets | `out/`, copied into each platform on sync |

Icons and splash screens for every platform size were generated from the two
source images with `npx capacitor-assets generate`. Re-run it after changing
either source image.

The status bar overlays the webview and the splash hides after 600ms, because
the site has its own entry gate and loader — a long native splash on top of
those would mean two loading screens.

## Known limitations in the webview

- **The résumé link.** `<a download>` is unreliable in an Android WebView. If
  it misbehaves in the app, route it through `@capacitor/browser` (already a
  dependency) to open the PDF in the system browser instead.
- **The startup sound.** The same autoplay rule applies inside a webview, which
  is why the ENTER gate exists. It works there for the same reason it works on
  the web.

## After changing the site

```bash
npm run app:sync
```

Then rebuild in Android Studio or Xcode. `sync` re-exports the web assets,
copies them into both platforms, and updates native dependencies.
