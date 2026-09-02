"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { skills } from "@/data/resume";

// The craft section as category tabs — the concept picked from the Craft
// Tiles mockups. Category files as tab pills (backend.ts, frontend.ts…),
// tiles animating in only when the tab switches. Gently auto-advances
// while in view so the section feels alive, but the first click or tap
// hands control to the visitor for good. Two tile shades, no per-tech
// colors, no continuous motion.

const CATS = Object.keys(skills) as (keyof typeof skills)[];

export default function BetaCraft() {
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const interactedRef = useRef(false);
  const inViewRef = useRef(false);

  // auto-advance until the visitor takes over
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => (inViewRef.current = e.isIntersecting)),
      { threshold: 0.3 }
    );
    io.observe(wrap);
    const id = setInterval(() => {
      if (!interactedRef.current && inViewRef.current) {
        setActive((a) => (a + 1) % CATS.length);
      }
    }, 3000);
    return () => {
      io.disconnect();
      clearInterval(id);
    };
  }, []);

  const pick = (i: number) => {
    interactedRef.current = true;
    setActive(i);
  };

  const cat = CATS[active];

  return (
    <section
      id="craft"
      className="relative border-t border-[#1c2621] px-6 py-28 sm:px-10 sm:py-40"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.6 }}
        className="mb-14 flex items-end justify-between sm:mb-20"
      >
        <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-[#556058]">
          03 — Craft
        </h2>
        <span className="font-mono text-xs text-[#556058]">
          {CATS.reduce((n, c) => n + skills[c].length, 0)} tools
        </span>
      </motion.div>

      <div ref={wrapRef} className="mx-auto max-w-4xl">
        {/* category file tabs */}
        <div role="tablist" aria-label="Skill categories" className="mb-10 flex flex-wrap gap-2">
          {CATS.map((c, i) => {
            const on = i === active;
            return (
              <button
                key={c}
                role="tab"
                aria-selected={on}
                aria-controls="craft-panel"
                onClick={() => pick(i)}
                className={`rounded-full border px-4 py-2 font-mono text-xs transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#39ff8e] ${
                  on
                    ? "border-[#39ff8e]/40 bg-[#131e24] text-[#e8efe9]"
                    : "border-[#1c2621] text-[#556058] hover:text-[#8b978f]"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* tiles for the active category */}
        <div
          id="craft-panel"
          role="tabpanel"
          key={cat}
          className="flex min-h-[140px] flex-wrap content-start gap-2"
        >
          {skills[cat].map((name, i) => (
            <motion.span
              key={name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05, ease: "easeOut" }}
              className="rounded-md border border-[#16222a] bg-[#0c1216] px-4 py-2.5 font-mono text-[13px] text-[#e8efe9] transition-colors hover:bg-[#131e24]"
            >
              {name}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
