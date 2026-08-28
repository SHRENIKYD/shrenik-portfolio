import type { NextConfig } from "next";
import { readFileSync } from "node:fs";

// The version shown in the UI comes from package.json, the same field the
// Android and iOS projects are synced from, so every surface agrees.
const { version } = JSON.parse(readFileSync("./package.json", "utf8"));

// Set NEXT_PUBLIC_BASE_PATH to "/<repo-name>" when deploying to
// https://<username>.github.io/<repo-name>/ (project page).
// Leave it unset/empty for a user page (https://<username>.github.io/).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_APP_VERSION: version,
  },
};

export default nextConfig;
