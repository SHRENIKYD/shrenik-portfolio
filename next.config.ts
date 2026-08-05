import type { NextConfig } from "next";

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
  },
};

export default nextConfig;
