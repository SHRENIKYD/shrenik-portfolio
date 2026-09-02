"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, GitBranch, GraduationCap, Sparkles } from "lucide-react";
import { education, jobs } from "@/data/resume";
import { allProjects } from "@/lib/projects";

// One continuous journey section: the job history first, then education,
// then the projects that came out of it all — Work and Experience merged
// per the one-page story. All facts straight from resume.ts; the project
// cards keep the floating-glass treatment from the old Work section.



const TINTS = [
  { rgb: "57,255,142", hex: "#39ff8e" },
  { rgb: "108,182,255", hex: "#6cb6ff" },
  { rgb: "160,123,255", hex: "#a07bff" },
  { rgb: "255,106,193", hex: "#ff6ac1" },
  { rgb: "255,180,84", hex: "#ffb454" },
];

function ProjectCard({ proj, i }: { proj: (typeof allProjects)[number]; i: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const tint = TINTS[i % TINTS.length];
  const left = i % 2 === 0;

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

          <h4
            className="mt-4 font-bold leading-[1.02] tracking-tight text-[#e8efe9]"
            style={{ fontSize: "clamp(1.9rem, 4.5vw, 3rem)" }}
          >
            {proj.name}
          </h4>
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

                <Link
                  href={`/work/${proj.slug}/`}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[#8b978f] transition-colors hover:text-[#e8efe9]"
                >
                  Read the detail
                  <ArrowUpRight size={13} />
                </Link>
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

export default function BetaJourney() {
  return (
    <section
      id="experience"
      className="relative border-t border-[#1c2621] px-6 py-28 sm:px-10 sm:py-40"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.6 }}
        className="mb-16 flex items-end justify-between gap-4 sm:mb-24"
      >
        <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-[#556058]">
          01 — Experience
        </h2>
        <span className="font-mono text-xs text-[#556058]">
          {jobs.length} companies · {allProjects.length} projects · zero gaps
        </span>
      </motion.div>

      {/* the jobs, newest first */}
      <div className="mx-auto flex max-w-4xl flex-col gap-20 sm:gap-24">
        {jobs.map((job) => (
          <motion.article
            key={job.company}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative border-l border-[#1c2621] pl-6 sm:pl-10"
          >
            <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-[#39ff8e] shadow-[0_0_12px_rgba(57,255,142,0.6)]" />

            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h3
                className="font-bold leading-[1.02] tracking-tight text-[#e8efe9]"
                style={{ fontSize: "clamp(1.75rem, 4.5vw, 3rem)" }}
              >
                {job.company}
              </h3>
              <span className="flex items-center gap-1.5 rounded-full border border-[#1c2621] px-2.5 py-1 font-mono text-[10px] text-[#8b978f]">
                <GitBranch size={11} className="text-[#39ff8e]" />
                {job.branch}
              </span>
            </div>
            <div className="mt-2 font-mono text-xs text-[#6b7a72]">
              {job.designation} · {job.period}
            </div>

            <ul className="mt-6 space-y-1.5">
              {job.projects.map((proj) => (
                <li
                  key={proj.name}
                  className="flex flex-wrap items-baseline gap-x-2 text-sm leading-relaxed"
                >
                  <span className="shrink-0 text-[#39ff8e]">▸</span>
                  <span className="text-[#c9d1d9]">{proj.name}</span>
                  {proj.client && (
                    <span className="font-mono text-[11px] text-[#556058]">
                      for {proj.client}
                    </span>
                  )}
                </li>
              ))}
            </ul>

            {job.responsibilities && (
              <ul className="mt-6 max-w-2xl space-y-2 border-t border-[#1c2621]/60 pt-5">
                {job.responsibilities.map((r) => (
                  <li key={r} className="flex gap-2 text-sm leading-relaxed text-[#8b978f]">
                    <span className="shrink-0 text-[#556058]">—</span>
                    {r}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-6 flex flex-wrap gap-1.5">
              {job.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-[#1c2621] px-2 py-0.5 font-mono text-[10px] text-[#8b978f]"
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.article>
        ))}

        {/* where it started: education as the timeline's root node */}
        <motion.article
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12%" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative border-l border-[#1c2621] pl-6 sm:pl-10"
        >
          <span className="absolute -left-[5px] top-2 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[#6cb6ff] shadow-[0_0_12px_rgba(108,182,255,0.6)]" />

          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h3
              className="font-bold leading-[1.02] tracking-tight text-[#e8efe9]"
              style={{ fontSize: "clamp(1.5rem, 3.6vw, 2.4rem)" }}
            >
              {education.school}
            </h3>
            <span className="flex items-center gap-1.5 rounded-full border border-[#1c2621] px-2.5 py-1 font-mono text-[10px] text-[#8b978f]">
              <GraduationCap size={11} className="text-[#6cb6ff]" />
              education
            </span>
          </div>
          <div className="mt-2 font-mono text-xs text-[#6b7a72]">
            {education.degree} · CGPA {education.cgpa} · {education.period} ·{" "}
            {education.location}
          </div>
        </motion.article>
      </div>

      {/* the projects all of that produced */}
      <div id="work" className="mx-auto mt-28 max-w-6xl scroll-mt-24 sm:mt-36">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6 }}
          className="mb-16 flex items-end justify-between gap-4 sm:mb-24"
        >
          <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-[#556058]">
            the work it produced
          </h3>
          <span className="font-mono text-xs text-[#556058]">tap a card</span>
        </motion.div>

        <div className="flex flex-col gap-16 sm:gap-24">
          {allProjects.map((proj, i) => (
            <ProjectCard key={proj.name} proj={proj} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
