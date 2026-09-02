import Link from "next/link";
import type { Metadata } from "next";
import { profile } from "@/data/resume";

// Next's built-in 404 is light-themed. On a site that deliberately commits to
// one dark world, a white page with no branding is the single most jarring
// thing a visitor can hit — and it is what a stale or mistyped link lands on.
//
// The static export writes this to 404.html, which GitHub Pages serves for any
// unmatched path.

export const metadata: Metadata = {
  title: "Not found — Shrenik YD",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-9 bg-[#05080a] px-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-[#39ff8e]">
          404
        </span>
        <h1 className="font-mono text-2xl font-semibold tracking-[0.16em] text-[#e8efe9] sm:text-3xl">
          SHRENIK.YD
        </h1>
        <p className="font-mono text-[11px] tracking-[0.28em] text-[#556058]">
          {profile.title.toUpperCase()}
        </p>
      </div>

      <p className="max-w-sm text-sm leading-relaxed text-[#8fa3ab]">
        There is nothing at this address. The portfolio is one page — everything
        lives on it.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full border border-[#1c2621] px-8 py-3 font-mono text-xs uppercase tracking-[0.3em] text-[#c9d1d9] transition-colors hover:border-[#39ff8e]/60 hover:text-[#39ff8e]"
        >
          Take me back
        </Link>
        <a
          href={`mailto:${profile.email}`}
          className="rounded-full border border-transparent px-8 py-3 font-mono text-xs uppercase tracking-[0.3em] text-[#556058] transition-colors hover:text-[#39ff8e]"
        >
          Or say hello
        </a>
      </div>
    </main>
  );
}
