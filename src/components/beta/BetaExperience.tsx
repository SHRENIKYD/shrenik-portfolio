"use client";

import { motion } from "framer-motion";
import { GitBranch } from "lucide-react";
import { jobs } from "@/data/resume";

// The job history, which the Work section (project-first) doesn't tell:
// employer, role, dates, responsibilities. Editorial rows in the same
// voice as BetaWork — this is the "experience tab" of the IDE site,
// retold for /beta.

export default function BetaExperience() {
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
          02 — Experience
        </h2>
        <span className="font-mono text-xs text-[#556058]">
          {jobs.length} companies · zero gaps
        </span>
      </motion.div>

      <div className="mx-auto flex max-w-4xl flex-col gap-20 sm:gap-28">
        {jobs.map((job, i) => (
          <motion.article
            key={job.company}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative border-l border-[#1c2621] pl-6 sm:pl-10"
          >
            {/* timeline node */}
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

            {/* projects delivered there, one line each — details live in Work */}
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
                  {proj.period && (
                    <span className="font-mono text-[11px] text-[#556058]">
                      · {proj.period}
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
      </div>
    </section>
  );
}
