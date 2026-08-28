"use client";

import { useEffect } from "react";
import { profile } from "@/data/resume";

// Defence in depth. The WebGL crash that this was written for is fixed at
// source, but a portfolio showing a blank browser error page is the worst
// possible failure — the visitor is a recruiter who will simply close the
// tab. So if anything else ever throws, they still get the name, the role
// and a way to make contact.
//
// React routes errors thrown in render AND in effects to the nearest
// boundary, which is what makes this cover the interactive components.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // no analytics wired up yet, so at least leave a trail in the console
    console.error("Portfolio failed to render:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-[#05080a] px-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-[#39ff8e]">
          {profile.location.split(",")[0]}
        </span>
        <h1 className="font-mono text-2xl font-semibold tracking-[0.16em] text-[#e8efe9] sm:text-3xl">
          SHRENIK.YD
        </h1>
        <p className="font-mono text-[11px] tracking-[0.28em] text-[#556058]">
          {profile.title.toUpperCase()}
        </p>
      </div>

      <p className="max-w-sm text-sm leading-relaxed text-[#8fa3ab]">
        Something in this page failed to load on your device. The contact
        details below still work.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-mono text-xs tracking-[0.2em] text-[#9db4be]">
        <a href={`mailto:${profile.email}`} className="hover:text-[#39ff8e]">
          {profile.email}
        </a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#39ff8e]">
          LINKEDIN
        </a>
        <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-[#39ff8e]">
          GITHUB
        </a>
      </div>

      <button
        type="button"
        onClick={reset}
        className="rounded-full border border-[#1c2621] px-8 py-3 font-mono text-xs uppercase tracking-[0.3em] text-[#c9d1d9] transition-colors hover:border-[#39ff8e]/60 hover:text-[#39ff8e]"
      >
        Try again
      </button>
    </main>
  );
}
