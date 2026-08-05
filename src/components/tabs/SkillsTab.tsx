"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { skills } from "@/data/resume";
import Gutter from "@/components/Gutter";

const entries = Object.entries(skills);

export default function SkillsTab() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="flex">
      <Gutter />
      <div className="flex-1 min-w-0 px-4 sm:px-8 py-8 max-w-3xl">
        <div className="font-mono text-sm text-[#6b7a72] mb-6">
          <span className="text-[#556058]">01</span> // export default skills
        </div>

        <div className="font-mono text-[15px] leading-7 rounded-lg border border-[#1c2621] bg-[#0d1310] p-4 sm:p-6 overflow-x-auto">
          <div className="text-[#c9d1d9]">{"{"}</div>
          {entries.map(([group, list], gi) => (
            <div key={group} className="pl-4 sm:pl-6">
              <div>
                <span className="text-[#ffb454]">&quot;{group}&quot;</span>
                <span className="text-[#c9d1d9]">: [</span>
              </div>
              <div className="pl-4 sm:pl-6 flex flex-wrap gap-x-2 gap-y-2 py-2">
                {list.map((skill, si) => {
                  const key = `${group}-${skill}`;
                  return (
                    <motion.span
                      key={key}
                      onMouseEnter={() => setHovered(key)}
                      onMouseLeave={() => setHovered(null)}
                      initial={{ opacity: 0, y: 6 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: si * 0.03 }}
                      className={`cursor-default rounded-md px-2.5 py-1 text-[13px] transition-all border ${
                        hovered === key
                          ? "border-[#39ff8e] bg-[#39ff8e]/10 text-[#39ff8e] -translate-y-0.5"
                          : "border-[#1c2621] bg-[#101713] text-[#6cb6ff]"
                      }`}
                    >
                      &quot;{skill}&quot;
                      {si < list.length - 1 ? "," : ""}
                    </motion.span>
                  );
                })}
              </div>
              <div className="text-[#c9d1d9]">
                ]{gi < entries.length - 1 ? "," : ""}
              </div>
            </div>
          ))}
          <div className="text-[#c9d1d9]">{"}"}</div>
        </div>

        <p className="mt-6 text-xs font-mono text-[#556058]">
          hover a value to inspect it — this file doesn&apos;t throw.
        </p>
      </div>
    </div>
  );
}
