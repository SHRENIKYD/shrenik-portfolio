import type { CapacitorConfig } from "@capacitor/cli";

// Native shell around the exported site. The web assets are bundled into the
// app itself — nothing is fetched from the network at launch, so the app is
// fully offline from first run and the whole experience (WebGL background,
// the scored loader, the neon contact screen) ships as-is.
//
// IMPORTANT: build the web assets with an EMPTY NEXT_PUBLIC_BASE_PATH. The
// GitHub Pages build prefixes everything with /shrenik-portfolio, which does
// not exist inside the app's webview and would leave a blank screen. Use
// `npm run app:build`, never a plain `next build`, before syncing.
const config: CapacitorConfig = {
  appId: "in.shrenikyd.portfolio",
  appName: "Shrenik.YD",
  webDir: "out",

  android: {
    // matches the site's ground colour so there is no white flash on rotate
    backgroundColor: "#05080a",
  },
  ios: {
    backgroundColor: "#05080a",
    contentInset: "never",
  },

  plugins: {
    SplashScreen: {
      // The site has its own entry gate and loader; a long native splash on
      // top of that would mean two loading screens. This one only covers the
      // webview boot, then hands over.
      launchShowDuration: 600,
      launchAutoHide: true,
      backgroundColor: "#05080a",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: "DARK", // light glyphs on our dark ground
      backgroundColor: "#05080a",
      overlaysWebView: true, // the site already draws edge to edge
    },
  },
};

export default config;
