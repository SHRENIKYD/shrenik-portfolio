"use client";

import { motion } from "framer-motion";
import { jobs } from "@/data/resume";
import Gutter from "@/components/Gutter";
import { Folder, Sparkles } from "lucide-react";

// Project-first view of the same data the Experience tab already tells
// job-first — no case-study write-ups, screenshots, or links, since none
// of that is available for these projects. Every bullet/tech tag here is
// pulled straight from resume.ts, not invented for this tab.
const allProjects = jobs.flatMap((job) =>
  job.projects.map((proj) => ({
    ...proj,
    company: job.company,
    tech: job.tech,
  }))
);

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: "easeOut" as const },
  }),
};

export default function ProjectsTab() {
  return (
    <div className="flex w-full min-h-full items-start">
      <Gutter />
      <div className="flex-1 min-w-0 px-4 sm:px-8 py-8 max-w-3xl bg-[#0a0e0c]">
        <div className="font-mono text-sm text-[#6b7a72] mb-2">
          <span className="text-[#556058]">01</span> // ls -la projects/
        </div>
        <p className="text-sm text-[#8b978f] mb-8 max-w-xl leading-relaxed">
          The projects behind the job history on the Experience tab, pulled
          together in one place.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {allProjects.map((proj, i) => (
            <motion.div
              key={proj.name}
              initial="hidden"
              animate="show"
              custom={i}
              variants={fadeUp}
              className="flex flex-col rounded-lg border border-[#1c2621] bg-[#0d1310] p-4 hover:border-[#39ff8e]/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#556058]">
                  <Folder size={12} className="text-[#39ff8e]" />
                  {proj.company}
                </div>
                {proj.period && (
                  <span className="font-mono text-[10px] text-[#556058] whitespace-nowrap">
                    {proj.period}
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-[#e8efe9] mb-1">
                {proj.name}
              </h3>
              <div className="mb-2 font-mono text-[11px] text-[#6cb6ff] min-h-[1.1em]">
                {proj.client && <>for {proj.client}</>}
              </div>

              {proj.highlight && (
                <div className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-[#39ff8e]/30 bg-[#39ff8e]/10 px-2.5 py-1 font-mono text-[11px] text-[#39ff8e]">
                  <Sparkles size={11} />
                  {proj.highlight}
                </div>
              )}

              <ul className="space-y-1.5 mb-3 flex-1">
                {proj.bullets.slice(0, 3).map((b) => (
                  <li key={b} className="flex gap-2 text-[13px] leading-relaxed text-[#c9d1d9]">
                    <span className="text-[#556058] shrink-0">▸</span>
                    {b}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#1c2621]">
                {proj.tech.slice(0, 5).map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[#1c2621] bg-[#101713] px-2 py-0.5 text-[10px] font-mono text-[#8b978f]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 rounded-lg border border-dashed border-[#1c2621] px-4 py-4 text-xs font-mono text-[#556058] leading-relaxed">
          note: full breakdown (all bullets, responsibilities) lives on the
          Experience tab — this is the same facts, organized by project
          instead of by employer.
        </div>
      </div>

      <div className="hidden lg:block flex-1" />
    </div>
  );
}
