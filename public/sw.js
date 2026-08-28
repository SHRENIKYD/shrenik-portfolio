/* Service worker for the installed app.
 *
 * Two jobs: make the site launch instantly on a repeat visit, and keep it
 * usable with no connection at all. Deliberately small — there is no build
 * step generating a precache manifest, so the shell is precached by hand and
 * everything else is cached as it is actually requested.
 *
 * Strategies:
 *   navigations  — network first, cache as fallback. A redeploy is picked up
 *                  immediately; offline still gets the last page seen.
 *   build assets — cache first. Everything under /_next/static/ is hashed and
 *                  therefore immutable, so a hit is always correct.
 *
 * VERSION is written from package.json by scripts/sync-version.mjs — do not
 * edit it here. Releasing a new version evicts every older cache on activate.
 */

const VERSION = "v1.0.3";
const CACHE = `shrenik-portfolio-${VERSION}`;

// "/" locally, "/shrenik-portfolio/" on GitHub Pages — derived rather than
// hardcoded so the basePath never has to be repeated here.
const SCOPE = new URL(self.registration.scope).pathname;
const SHELL = [SCOPE, `${SCOPE}beta/`];

const CACHEABLE = /\.(?:png|svg|jpe?g|webp|ico|woff2?|ttf|pdf|css|js)$/;

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      // one bad URL must not fail the whole install
      await Promise.all(SHELL.map((url) => cache.add(url).catch(() => {})));
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(CACHE);
          cache.put(req, fresh.clone());
          return fresh;
        } catch {
          return (
            (await caches.match(req)) ||
            (await caches.match(SCOPE)) ||
            new Response("Offline", { status: 503, statusText: "Offline" })
          );
        }
      })()
    );
    return;
  }

  event.respondWith(
    (async () => {
      const hit = await caches.match(req);
      if (hit) return hit;
      try {
        const res = await fetch(req);
        if (res.ok && (url.pathname.includes("/_next/static/") || CACHEABLE.test(url.pathname))) {
          const cache = await caches.open(CACHE);
          cache.put(req, res.clone());
        }
        return res;
      } catch {
        return new Response("", { status: 504, statusText: "Offline" });
      }
    })()
  );
});
