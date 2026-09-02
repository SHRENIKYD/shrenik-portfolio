#!/usr/bin/env node
// Serves the static export for the end-to-end tests.
//
// Deliberately dependency-free: the tests need a plain static file server and
// nothing more, and adding one to the dependency tree of a portfolio to run
// its own tests is not worth it.

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const ROOT = new URL("../out/", import.meta.url).pathname;
const PORT = Number(process.env.PORT || 4321);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".txt": "text/plain; charset=utf-8",
};

async function resolve(urlPath) {
  // strip the query, refuse to climb out of the export directory
  const clean = normalize(decodeURIComponent(urlPath.split("?")[0])).replace(/^(\.\.[/\\])+/, "");
  let file = join(ROOT, clean);
  try {
    if ((await stat(file)).isDirectory()) file = join(file, "index.html");
    return file;
  } catch {
    // trailingSlash: true means /beta is really /beta/index.html
    for (const candidate of [`${file}.html`, join(file, "index.html")]) {
      try {
        await stat(candidate);
        return candidate;
      } catch {
        /* keep looking */
      }
    }
    return null;
  }
}

createServer(async (req, res) => {
  const file = await resolve(req.url || "/");
  if (!file) {
    // GitHub Pages serves 404.html for any unmatched path; match that here so
    // the tests exercise the page visitors actually get.
    try {
      const notFound = await readFile(join(ROOT, "404.html"));
      res.writeHead(404, { "content-type": TYPES[".html"] });
      res.end(notFound);
    } catch {
      res.writeHead(404, { "content-type": "text/plain" });
      res.end("not found");
    }
    return;
  }
  try {
    const body = await readFile(file);
    res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(500, { "content-type": "text/plain" });
    res.end("read error");
  }
}).listen(PORT, () => {
  console.log(`serving out/ on http://localhost:${PORT}`);
});
