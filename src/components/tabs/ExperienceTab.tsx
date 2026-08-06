"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { jobs } from "@/data/resume";
import Gutter from "@/components/Gutter";
import { GitCommit, GitBranch, ChevronDown, Tag } from "lucide-react";

function hash(s: string, salt: number) {
  let h = salt;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h.toString(16).slice(0, 7);
}

export default function ExperienceTab() {
  const [openJob, setOpenJob] = useState<number>(0);

  return (
    <div className="flex w-full min-h-full items-start">
      <Gutter />
      <div className="flex-1 min-w-0 px-4 sm:px-8 py-8 max-w-3xl bg-[#0a0e0c]">
        <div className="font-mono text-sm text-[#6b7a72] mb-6">
          <span className="text-[#556058]">01</span> // git log --graph --all
        </div>

        <div className="relative pl-6 sm:pl-8">
          <div className="absolute left-[7px] sm:left-[9px] top-2 bottom-2 w-px bg-[#1c2621]" />

          {jobs.map((job, ji) => {
            const isOpen = openJob === ji;
            return (
              <div key={job.company} className="relative mb-6">
                <span
                  className={`absolute -left-[19px] sm:-left-[23px] top-1.5 h-3.5 w-3.5 rounded-full border-2 ${
                    isOpen
                      ? "border-[#39ff8e] bg-[#0a0e0c] glow-pulse"
                      : "border-[#3a4a41] bg-[#0a0e0c]"
                  }`}
                />
                <button
                  onClick={() => setOpenJob(isOpen ? -1 : ji)}
                  className="w-full text-left rounded-lg border border-[#1c2621] bg-[#0d1310] px-4 py-3.5 hover:border-[#39ff8e]/40 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 font-mono text-xs text-[#6b7a72]">
                      <GitBranch size={13} className="text-[#39ff8e]" />
                      {job.branch}
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-[#6b7a72] transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  <div className="mt-1.5 flex items-baseline gap-2 flex-wrap">
                    <span className="text-lg font-bold text-[#e8efe9]">
                      {job.company}
                    </span>
                    <span className="text-sm text-[#8b978f]">
                      {job.designation}
                    </span>
                  </div>
                  <div className="mt-0.5 font-mono text-xs text-[#556058]">
                    {job.period}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 space-y-4 pl-1 sm:pl-2">
                        {job.projects.map((proj) => (
                          <div key={proj.name}>
                            <div className="flex items-baseline gap-2 flex-wrap font-mono text-xs uppercase tracking-wide text-[#39ff8e] mb-2">
                              {proj.name}
                              {proj.client && (
                                <span className="text-[10px] normal-case tracking-normal text-[#6cb6ff]">
                                  for {proj.client}
                                </span>
                              )}
                              {proj.period && (
                                <span className="text-[10px] normal-case tracking-normal text-[#556058]">
                                  {proj.period}
                                </span>
                              )}
                            </div>
                            <ul className="space-y-2.5">
                              {proj.bullets.map((b) => (
                                <li key={b} className="group">
                                  <div className="flex gap-2 font-mono text-[11px] text-[#556058]">
                                    <GitCommit size={12} className="mt-0.5 shrink-0 text-[#3a4a41] group-hover:text-[#39ff8e] transition-colors" />
                                    <span className="text-[#3a4a41]">
                                      {hash(b, ji + 1)}
                                    </span>
                                  </div>
                                  <p className="pl-[18px] text-sm leading-relaxed text-[#c9d1d9]">
                                    {b}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}

                        {job.responsibilities && (
                          <div>
                            <div className="font-mono text-xs uppercase tracking-wide text-[#6cb6ff] mb-2">
                              key responsibilities
                            </div>
                            <ul className="space-y-2">
                              {job.responsibilities.map((r) => (
                                <li
                                  key={r}
                                  className="flex gap-2 text-sm leading-relaxed text-[#c9d1d9]"
                                >
                                  <span className="text-[#6cb6ff]">▸</span>
                                  {r}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          <Tag size={12} className="text-[#556058]" />
                          {job.tech.map((t) => (
                            <span
                              key={t}
                              className="rounded-full border border-[#1c2621] bg-[#101713] px-2.5 py-0.5 text-[11px] font-mono text-[#8b978f]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      <div className="hidden lg:block flex-1" />
    </div>
  );
}
