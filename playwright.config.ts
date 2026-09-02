import { defineConfig, devices } from "@playwright/test";

// Smoke tests against the built static export — the same artifact that gets
// deployed, not a dev server, because several of the things worth guarding
// (the service worker, the social card, the basePath) only exist in a build.
const PORT = 4321;

// Escape hatch for environments that already have a browser and cannot run
// `playwright install` — CI images, locked-down machines. Unset everywhere
// else, in which case Playwright uses its own managed download.
const launchOverride = process.env.PLAYWRIGHT_CHROMIUM_PATH
  ? { launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH } }
  : {};

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",

  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
  },

  webServer: {
    command: "node scripts/serve-out.mjs",
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },

  projects: [
    {
      name: "chromium",
      // the other projects own these; without the ignore they would also run
      // here, under the wrong viewport and with WebGL enabled
      testIgnore: [/no-webgl\.spec\.ts/, /mobile\.spec\.ts/],
      use: { ...devices["Desktop Chrome"], ...launchOverride },
    },
    {
      // The site once rendered a blank error page without a WebGL context.
      // This project is the guard against that regression coming back.
      name: "no-webgl",
      testMatch: /no-webgl\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: { ...launchOverride.launchOptions, args: ["--disable-3d-apis"] },
      },
    },
    {
      name: "mobile",
      testMatch: /mobile\.spec\.ts/,
      use: { ...devices["Pixel 7"], ...launchOverride },
    },
  ],
});
