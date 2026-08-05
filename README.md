# Shrenik YD — Interactive Resume Site

A terminal/IDE-themed, single-page interactive portfolio built from [Shrenik YD's](mailto:shrenikyd@gmail.com) resume. Dark theme, terminal-green accent, VS Code-style shell (file explorer, tabs, status bar), a `Ctrl/Cmd+K` command palette, and an interactive "architecture diagram" tab that animates how a request flows through the systems described in the resume.

Built with Next.js (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion, exported as a fully static site so it can be hosted for free on GitHub Pages.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Edit content

All resume content lives in one place: [`src/data/resume.ts`](src/data/resume.ts) (profile, jobs, skills, education, architecture narrative). Tab/file labels are in [`src/data/tabs.ts`](src/data/tabs.ts). Change the data files — the UI updates automatically, no need to touch components.

To swap the résumé PDF users can download from the Contact tab / command palette, replace [`public/Shrenik_YD_Resume.pdf`](public/Shrenik_YD_Resume.pdf) (keep the same filename, or update `resumeFile` in `resume.ts`).

## Deploy to GitHub Pages

This repo ships a GitHub Actions workflow ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) that builds the static export and deploys it automatically on every push to `main`/`master`.

1. Push this repo to GitHub.
2. In the repo, go to **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**.
3. Push to `main` (or run the workflow manually from the **Actions** tab). Your site will be live at:
   - `https://<username>.github.io/<repo-name>/` (project page — the default, what the workflow assumes), or
   - `https://<username>.github.io/` if this repo is literally named `<username>.github.io` (a user page).

If it's a **user page** (`<username>.github.io`), open `.github/workflows/deploy.yml` and delete the `NEXT_PUBLIC_BASE_PATH` line under the build step — user pages are served from the domain root and don't need a base path.

### Manual build (no CI)

```bash
NEXT_PUBLIC_BASE_PATH=/your-repo-name npm run build
```

The static site is written to `out/`. Push that folder's contents to a `gh-pages` branch (or any static host) if you'd rather not use the included Actions workflow.

## Stack

- Next.js 16 (static export, `output: "export"`)
- TypeScript
- Tailwind CSS v4
- Framer Motion (animations)
- lucide-react (icons; brand icons for GitHub/LinkedIn are small inline SVGs in [`src/components/BrandIcons.tsx`](src/components/BrandIcons.tsx) since lucide dropped logo icons)
