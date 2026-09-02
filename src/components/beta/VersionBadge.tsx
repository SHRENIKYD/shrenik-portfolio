"use client";

import { useSyncExternalStore } from "react";

// The same bundle runs on the web and inside the native app, so a version
// alone does not say which build someone is looking at. This stamps the
// surface alongside it — "v1.0.4 · web" or "v1.0.4 · app" — which is the
// difference between a useful bug report and a guess.
//
// Capacitor injects a global into the webview; reading it avoids pulling
// @capacitor/core into the web bundle, where it would be dead weight.
type CapacitorGlobal = { getPlatform?: () => string };

function readPlatform(): "web" | "app" {
  if (typeof window === "undefined") return "web";
  const cap = (window as Window & { Capacitor?: CapacitorGlobal }).Capacitor;
  return cap?.getPlatform?.() === "web" || !cap?.getPlatform ? "web" : "app";
}

// useSyncExternalStore rather than an effect: the value never changes after
// load, and this is the one pattern that gives the server a different
// snapshot from the client without a hydration mismatch — or a setState
// inside an effect, which is what the lint rule is there to prevent.
const subscribe = () => () => {};
const serverSnapshot = () => "web" as const;

export default function VersionBadge({ className }: { className?: string }) {
  const platform = useSyncExternalStore(subscribe, readPlatform, serverSnapshot);
  return (
    <span className={className}>
      v{process.env.NEXT_PUBLIC_APP_VERSION} · {platform}
    </span>
  );
}
