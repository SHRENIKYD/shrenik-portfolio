"use client";

/** Decorative line-number gutter for the fake-editor look. Not literal. */
export default function Gutter({ lines = 80 }: { lines?: number }) {
  return (
    <div
      aria-hidden
      className="hidden sm:block select-none pr-3 pt-6 text-right font-mono text-[11px] leading-6 text-[#2a3630]"
    >
      {Array.from({ length: lines }, (_, i) => (
        <div key={i}>{i + 1}</div>
      ))}
    </div>
  );
}
