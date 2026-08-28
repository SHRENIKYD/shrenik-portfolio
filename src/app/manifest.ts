import type { MetadataRoute } from "next";
import { withBasePath } from "@/lib/basePath";

// Makes the site installable: "Add to Home Screen" gives a real icon, no
// browser chrome, and a standalone launch. Emitted as a static file by the
// export, so it works on GitHub Pages with no server.
//
// Every URL here is absolute-from-root and must carry the basePath itself —
// Next prefixes its own links, not strings we write.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shrenik YD — Senior Software Engineer",
    short_name: "Shrenik.YD",
    description:
      "Full-stack .NET and Angular engineer in Bengaluru. An interactive portfolio you can keep on your home screen.",
    start_url: withBasePath("/"),
    scope: withBasePath("/"),
    id: withBasePath("/"),
    display: "standalone",
    orientation: "portrait",
    background_color: "#05080a",
    theme_color: "#05080a",
    categories: ["portfolio", "developer", "business"],
    icons: [
      {
        src: withBasePath("/icons/icon-192.png"),
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: withBasePath("/icons/icon-512.png"),
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        // Android crops icons to its own shape — this one keeps the mark
        // well inside the safe circle so nothing gets clipped.
        src: withBasePath("/icons/icon-maskable.png"),
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
