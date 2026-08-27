"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { jobs } from "@/data/resume";

// Same underlying facts as the IDE version's Experience/Projects tabs —
// no case-study write-ups, screenshots, or invented detail, since none of
// that exists for this work. Just presented as full-bleed editorial rows
// instead of a card grid.
const allProjects = jobs.flatMap((job) =>
  job.projects.map((proj) => ({ ...proj, company: job.company, tech: job.tech }))
);

export default function BetaWork() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="work" className="relative px-6 py-28 sm:px-10 sm:py-40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.6 }}
        className="mb-16 flex items-end justify-between gap-4 sm:mb-24"
      >
        <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-[#556058]">
          01 — Work
        </h2>
        <span className="font-mono text-xs text-[#556058]">{allProjects.length} projects</span>
      </motion.div>

      <div className="border-t border-[#1c2621]">
        {allProjects.map((proj, i) => (
          <motion.div
            key={proj.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, delay: 0.05 }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="group grid cursor-default grid-cols-1 gap-3 border-b border-[#1c2621] py-8 transition-colors sm:grid-cols-[3rem_1fr_auto] sm:items-baseline sm:gap-6 sm:py-10"
          >
            <span className="font-mono text-xs text-[#556058]">
              {String(i + 1).padStart(2, "0")}
            </span>

            <div>
              <div
                className={`font-bold leading-[1.05] tracking-tight transition-colors ${
                  hovered === null || hovered === i ? "text-[#e8efe9]" : "text-[#3a4a41]"
                }`}
                style={{ fontSize: "clamp(1.75rem, 5vw, 3.5rem)" }}
              >
                {proj.name}
              </div>
              <div className="mt-2 font-mono text-xs text-[#6b7a72] sm:mt-3">
                {proj.company}
                {proj.client && <> · for {proj.client}</>}
                {proj.period && <> · {proj.period}</>}
              </div>

              <motion.div
                initial={false}
                animate={{
                  height: hovered === i ? "auto" : 0,
                  opacity: hovered === i ? 1 : 0,
                }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <ul className="mt-5 max-w-2xl space-y-2">
                  {proj.bullets.slice(0, 3).map((b) => (
                    <li key={b} className="flex gap-2 text-sm leading-relaxed text-[#8b978f]">
                      <span className="shrink-0 text-[#39ff8e]">▸</span>
                      {b}
                    </li>
                  ))}
                </ul>
                {proj.highlight && (
                  <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#39ff8e]/30 bg-[#39ff8e]/10 px-2.5 py-1 font-mono text-[11px] text-[#39ff8e]">
                    <Sparkles size={11} />
                    {proj.highlight}
                  </div>
                )}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {proj.tech.slice(0, 6).map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-[#1c2621] px-2 py-0.5 font-mono text-[10px] text-[#8b978f]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>

            <ArrowUpRight
              size={22}
              className={`hidden shrink-0 self-start transition-all sm:block ${
                hovered === i
                  ? "translate-x-0 translate-y-0 text-[#39ff8e] opacity-100"
                  : "-translate-x-2 translate-y-2 text-[#556058] opacity-0"
              }`}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
