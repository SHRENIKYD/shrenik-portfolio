"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Sparkles } from "lucide-react";
import { jobs } from "@/data/resume";

// Work as floating glass panels drifting past the central WebGL spine —
// tilted in 3D, alternating sides, each with its own scroll parallax —
// after the floating project cards on activetheory.net/work. Same
// underlying facts as the IDE version's Experience/Projects tabs: no
// case-study write-ups, imagery, or invented detail exists for these,
// so the cards stay typographic.
const allProjects = jobs.flatMap((job) =>
  job.projects.map((proj) => ({ ...proj, company: job.company, tech: job.tech }))
);

// per-card accent tint, cycled
const TINTS = [
  { rgb: "57,255,142", hex: "#39ff8e" },
  { rgb: "108,182,255", hex: "#6cb6ff" },
  { rgb: "160,123,255", hex: "#a07bff" },
  { rgb: "255,106,193", hex: "#ff6ac1" },
  { rgb: "255,180,84", hex: "#ffb454" },
];

function ProjectCard({
  proj,
  i,
}: {
  proj: (typeof allProjects)[number];
  i: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const tint = TINTS[i % TINTS.length];
  const left = i % 2 === 0;

  // each card drifts vertically at its own rate as it crosses the viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40 + (i % 3) * 14, -40 - (i % 3) * 14]);

  return (
    <div
      ref={ref}
      className={`flex ${left ? "sm:justify-start" : "sm:justify-end"}`}
      style={{ perspective: 1200 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-12%" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ y: reduce ? 0 : y }}
        className="w-full sm:w-[560px]"
      >
        <div
          role="button"
          tabIndex={0}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpen((o) => !o);
            }
          }}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className="group cursor-pointer rounded-2xl border p-7 backdrop-blur-md transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#39ff8e] sm:p-9"
          style={{
            transform: reduce ? undefined : `rotateY(${left ? 7 : -7}deg) rotateX(2deg)`,
            transformStyle: "preserve-3d",
            borderColor: open ? `rgba(${tint.rgb},0.45)` : "rgba(255,255,255,0.1)",
            background: `linear-gradient(135deg, rgba(${tint.rgb},0.09), rgba(255,255,255,0.02) 55%, rgba(5,8,10,0.4))`,
            boxShadow: open
              ? `0 24px 60px rgba(0,0,0,0.5), 0 0 40px rgba(${tint.rgb},0.14)`
              : "0 18px 50px rgba(0,0,0,0.45)",
          }}
        >
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#6b7a72]">
              {String(i + 1).padStart(2, "0")} · {proj.company}
            </span>
            {proj.period && (
              <span className="whitespace-nowrap font-mono text-[10px] text-[#556058]">
                {proj.period}
              </span>
            )}
          </div>

          <h3
            className="mt-4 font-bold leading-[1.02] tracking-tight text-[#e8efe9]"
            style={{ fontSize: "clamp(1.9rem, 4.5vw, 3rem)" }}
          >
            {proj.name}
          </h3>
          {proj.client && (
            <div className="mt-2 font-mono text-xs" style={{ color: tint.hex }}>
              for {proj.client}
            </div>
          )}

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <ul className="mt-5 space-y-2">
                  {proj.bullets.slice(0, 3).map((b) => (
                    <li key={b} className="flex gap-2 text-sm leading-relaxed text-[#a9b5ac]">
                      <span className="shrink-0" style={{ color: tint.hex }}>
                        ▸
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
                {proj.highlight && (
                  <div
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px]"
                    style={{
                      color: tint.hex,
                      borderColor: `rgba(${tint.rgb},0.35)`,
                      background: `rgba(${tint.rgb},0.08)`,
                    }}
                  >
                    <Sparkles size={11} />
                    {proj.highlight}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 flex flex-wrap gap-1.5 border-t border-white/5 pt-4">
            {proj.tech.slice(0, 6).map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] text-[#8b978f]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function BetaWork() {
  return (
    <section id="work" className="relative px-6 py-28 sm:px-10 sm:py-40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.6 }}
        className="mb-16 flex items-end justify-between gap-4 sm:mb-28"
      >
        <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-[#556058]">
          01 — Work
        </h2>
        <span className="font-mono text-xs text-[#556058]">
          {allProjects.length} projects · tap a card
        </span>
      </motion.div>

      <div className="mx-auto flex max-w-6xl flex-col gap-16 sm:gap-24">
        {allProjects.map((proj, i) => (
          <ProjectCard key={proj.name} proj={proj} i={i} />
        ))}
      </div>
    </section>
  );
}
