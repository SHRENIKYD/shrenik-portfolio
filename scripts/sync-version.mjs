#!/usr/bin/env node
// package.json is the single source of truth for the version. Everything
// else — the Android manifest, the Xcode project, the service worker's cache
// name — is written from it by this script, so a release is one field edit
// followed by `npm run version:sync`.
//
// Run automatically as part of `npm run app:sync`.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");
const write = (p, s) => writeFileSync(join(root, p), s);

const { version } = JSON.parse(read("package.json"));

const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
if (!m) {
  console.error(`package.json version must be plain semver (x.y.z), got "${version}"`);
  process.exit(1);
}
const [major, minor, patch] = m.slice(1).map(Number);

// Play Store requires a monotonically increasing integer, and it can never go
// backwards for a given package. Packing the semver keeps it ordered and
// leaves room for 100 patches and 100 minors per major.
const versionCode = major * 10000 + minor * 100 + patch;

const edits = [];

function patchFile(path, replacements) {
  let s = read(path);
  const before = s;
  for (const [re, to] of replacements) {
    if (!re.test(s)) {
      console.error(`sync-version: pattern not found in ${path}: ${re}`);
      process.exit(1);
    }
    s = s.replace(re, to);
  }
  if (s !== before) {
    write(path, s);
    edits.push(path);
  }
}

// --- Android -------------------------------------------------------------
patchFile("android/app/build.gradle", [
  [/versionCode\s+\d+/g, `versionCode ${versionCode}`],
  [/versionName\s+"[^"]*"/g, `versionName "${version}"`],
]);

// --- iOS -----------------------------------------------------------------
// MARKETING_VERSION is what the App Store shows; CURRENT_PROJECT_VERSION is
// the build number, which must increase with every upload.
patchFile("ios/App/App.xcodeproj/project.pbxproj", [
  [/MARKETING_VERSION = [^;]+;/g, `MARKETING_VERSION = ${version};`],
  [/CURRENT_PROJECT_VERSION = [^;]+;/g, `CURRENT_PROJECT_VERSION = ${versionCode};`],
]);

// --- Service worker ------------------------------------------------------
// The cache name carries the version, so shipping a release evicts every
// cache from the previous one on the next activate.
patchFile("public/sw.js", [[/const VERSION = "[^"]*";/, `const VERSION = "v${version}";`]]);

console.log(`version ${version} (android versionCode ${versionCode})`);
console.log(edits.length ? `updated:\n  ${edits.join("\n  ")}` : "already in sync");
