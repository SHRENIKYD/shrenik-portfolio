// Prefixes a root-relative public asset path with NEXT_PUBLIC_BASE_PATH.
// Needed for any hand-authored `<img src="/...">`, `fetch("/...")`, or
// `window.open("/...")` — Next.js only auto-prefixes next/image, next/link,
// and webpack-bundled assets; plain string paths are left untouched, which
// silently 404s once the site is deployed under a subpath (GitHub Pages
// project pages, e.g. /shrenik-portfolio/).
export function withBasePath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
