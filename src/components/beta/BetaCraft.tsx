"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { skills } from "@/data/resume";

// The craft section as a descent — the "Depth elevator" concept picked
// from the Craft Tiles mockups. A depth gauge runs down the left and the
// car descends at one constant speed; each level is a skill category
// (backend at −10m, down to tools on the seabed), and that level's tiles
// surface as the car reaches it. Two tile shades only, no per-tech
// colors. Same descent story the site's sinking camera already tells.

const CATS = Object.keys(skills) as (keyof typeof skills)[];
const LABEL = (cat: string) => cat.replace(/\.(ts|json)$/, "");

const GAUGE_H = 380; // px — the travel of one full descent
const SPEED = 26; // px per second — constant

export default function BetaCraft() {
  const [floor, setFloor] = useState(0);
  const carRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduceRef = useRef(false);

  useEffect(() => {
    const car = carRef.current;
    const wrap = wrapRef.current;
    if (!car || !wrap) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    reduceRef.current = reduce;
    if (reduce) return; // static: all levels rendered below instead

    let y = 0;
    let raf = 0;
    let running = false;
    let last = performance.now();
    let current = -1;

    const tick = (now: number) => {
      const dt = Math.min(0.08, (now - last) / 1000);
      last = now;
      y += SPEED * dt;
      if (y >= GAUGE_H) y -= GAUGE_H;
      car.style.transform = `translateY(${y - 13}px)`;
      let fl = Math.floor((y / GAUGE_H) * CATS.length);
      fl = Math.max(0, Math.min(CATS.length - 1, fl));
      if (fl !== current) {
        current = fl;
        setFloor(fl);
      }
      if (running) raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => (e.isIntersecting ? start() : stop())),
      { threshold: 0.2 }
    );
    io.observe(wrap);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const cat = CATS[floor];

  return (
    <section id="craft" className="relative border-t border-[#1c2621] px-6 py-28 sm:px-10 sm:py-40">
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
          {CATS.reduce((n, c) => n + skills[c].length, 0)} tools · descending
        </span>
      </motion.div>

      {/* animated elevator (hidden for reduced-motion users) */}
      <div
        ref={wrapRef}
        className="mx-auto grid max-w-4xl grid-cols-[56px_1fr] gap-6 motion-reduce:hidden sm:grid-cols-[72px_1fr] sm:gap-10"
        style={{ minHeight: GAUGE_H }}
      >
        {/* gauge */}
        <div className="relative border-r border-[#1c2621]" style={{ height: GAUGE_H }}>
          {CATS.map((c, i) => (
            <div
              key={c}
              className="absolute right-2 -translate-y-1/2 font-mono text-[9px] transition-colors duration-300"
              style={{
                top: ((i + 0.5) / CATS.length) * GAUGE_H,
                color: i === floor ? "#7fa3b0" : "#3a4a41",
              }}
            >
              -{(i + 1) * 10}m
            </div>
          ))}
          <div
            ref={carRef}
            className="absolute -right-[5px] h-[26px] w-[9px] rounded border border-[#7fa3b0] bg-[#131e24]"
            style={{ willChange: "transform" }}
          />
        </div>

        {/* current level */}
        <div key={floor}>
          <motion.h3
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="font-mono text-2xl font-medium text-[#e8efe9] sm:text-3xl"
          >
            {LABEL(cat)}
          </motion.h3>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="mb-6 mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[#556058]"
          >
            level -{(floor + 1) * 10}m · {skills[cat].length} tool{skills[cat].length === 1 ? "" : "s"}
          </motion.div>
          <div className="flex flex-wrap gap-2">
            {skills[cat].map((name, i) => (
              <motion.span
                key={name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05, ease: "easeOut" }}
                className="rounded-md border border-[#16222a] bg-[#0c1216] px-3.5 py-2 font-mono text-xs text-[#e8efe9]"
              >
                {name}
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      {/* static fallback: every level, no motion */}
      <div className="mx-auto hidden max-w-4xl flex-col gap-10 motion-reduce:flex">
        {CATS.map((c, i) => (
          <div key={c}>
            <div className="font-mono text-lg font-medium text-[#e8efe9]">{LABEL(c)}</div>
            <div className="mb-4 mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[#556058]">
              level -{(i + 1) * 10}m · {skills[c].length} tool{skills[c].length === 1 ? "" : "s"}
            </div>
            <div className="flex flex-wrap gap-2">
              {skills[c].map((name) => (
                <span
                  key={name}
                  className="rounded-md border border-[#16222a] bg-[#0c1216] px-3.5 py-2 font-mono text-xs text-[#e8efe9]"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
