# Shrenik YD — Portfolio

A cinematic, scroll-driven portfolio for a full-stack .NET engineer, built as a
static site and shipped three ways: on the web, as an installable PWA, and as a
real Android and iOS app.

**[Open the site →](https://shrenikyd.github.io/shrenik-portfolio/)** &nbsp;·&nbsp;
**[Download the Android app →](https://github.com/SHRENIKYD/shrenik-portfolio/releases/latest)**

![The site after the loader](docs/screenshots/03-hero.jpg)

---

## The experience

The site opens on a gate, runs a loader, and then behaves less like a document
than like a place you move through.

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/01-gate.jpg" alt="Entry gate"></td>
    <td width="50%"><img src="docs/screenshots/02-loader.jpg" alt="Runaway terminal loader"></td>
  </tr>
  <tr>
    <td><b>The gate.</b> One click, which exists for a technical reason: browsers
    refuse to play audio before a visitor interacts with the page, and the loader
    runs before any interaction has happened.</td>
    <td><b>The loader.</b> A terminal types by itself, accelerating exponentially
    until the text is a blur, then collapses to a point and bursts back out as
    radial rays of glyphs.</td>
  </tr>
</table>

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/04-experience.jpg" alt="Experience timeline"></td>
    <td width="50%"><img src="docs/screenshots/06-craft.jpg" alt="Skills by category"></td>
  </tr>
  <tr>
    <td><b>Experience</b> as a git-style timeline — roles, the projects each one
    produced, and education as a root node.</td>
    <td><b>Craft</b> — skills as category tabs that advance on their own until you
    take over.</td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/08-contact.jpg" alt="Contact takeover"></td>
    <td><img src="docs/screenshots/07-about.jpg" alt="About section"></td>
  </tr>
  <tr>
    <td><b>Contact</b> is a full-screen takeover: a dead neon sign getting its
    power back, character by character, with a few tubes that stay faulty
    forever.</td>
    <td><b>About</b>, closing on the numbers that matter.</td>
  </tr>
</table>

### On a phone

<p>
  <img src="docs/screenshots/09-mobile-gate.jpg" alt="Gate on mobile" width="30%">
  <img src="docs/screenshots/10-mobile-hero.jpg" alt="Hero on mobile" width="30%">
  <img src="docs/screenshots/11-mobile-contact.jpg" alt="Contact on mobile" width="30%">
</p>

---

## What is actually going on under it

- **A WebGL underwater scene** (three.js) behind everything — particle clouds,
  bokeh, and drifting "marine snow" of code glyphs. The camera descends as you
  scroll. Pauses when the tab is hidden, and renders a single static frame under
  `prefers-reduced-motion`.
- **Weighted scrolling.** The page body carries the content's height, the content
  is pinned and translated, and that translation *eases* toward the real scroll
  position instead of matching it. Native scrolling still drives everything, so
  the wheel, keyboard and anchors behave normally.
- **A synthesized score.** No audio files anywhere — every sound is oscillators
  and filtered noise through a convolution reverb. The loader gets *Dead air*: a
  vast, almost inaudible room whose removal at the burst is the effect. The
  contact screen gets *Terminal*: a relay click per tube flicker, a keycap thock
  as each character locks. Both are driven off the same per-frame state as the
  visuals, so the audio cannot drift out of sync.
- **Offline from first run.** A service worker caches the shell; the native apps
  bundle the assets outright.

Everything respects `prefers-reduced-motion`, which turns off the loader, the
ignition, the eased scrolling and all sound.

---

## Running it

```bash
npm install
npm run dev            # http://localhost:3000
```

Other scripts:

| Command | What it does |
|---|---|
| `npm run build` | Static export to `out/` |
| `npm run app:build` | Same, but with no basePath — for the native apps |
| `npm run app:sync` | Sync version, build, and copy into `android/` and `ios/` |
| `npm run app:android` | The above, then open Android Studio |
| `npm run app:ios` | The above, then open Xcode |
| `npm run version:sync` | Push `package.json`'s version into every platform |
| `npm run lint` | ESLint |

## Editing the content

All of it lives in [`src/data/resume.ts`](src/data/resume.ts) — profile, jobs and
their projects, skills, education, stats. Change the data and the UI follows; no
component edits needed.

The downloadable résumé is [`public/Shrenik_YD_Resume.pdf`](public/Shrenik_YD_Resume.pdf).
Keep the filename or update `resumeFile` in `resume.ts`.

## Versioning

`package.json` is the single source of truth. `npm run version:sync` writes that
version into the Android manifest, the Xcode project and the service worker's
cache name, and the site displays it in the menu — so every surface agrees.
Android's `versionCode` is packed from the semver as
`major * 10000 + minor * 100 + patch`, because it must be an integer that never
goes backwards.

## The mobile apps

`android/` and `ios/` are real native projects wrapping the exported site with
Capacitor, with the web assets bundled into the binary.

The quickest way to an installable APK is the **Build Android APK** workflow in
the Actions tab — it builds on GitHub's runners and attaches the result to a
release, so nobody needs Android Studio locally. See
**[MOBILE.md](MOBILE.md)** for local builds, signing, and the App Store caveat.

## Deployment

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds the static
export and publishes it to GitHub Pages on every push to `main`. Pages must be
set to **Settings → Pages → Source → GitHub Actions**.

The build sets `NEXT_PUBLIC_BASE_PATH` to `/<repo-name>`, which project pages
need. If this repo were named `<username>.github.io`, that line should be
removed — user pages are served from the domain root.

## Built with

Next.js 16 (App Router, static export) · TypeScript · Tailwind CSS v4 ·
Framer Motion · three.js · Web Audio API · Capacitor
