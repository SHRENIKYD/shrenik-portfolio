"use client";

import { motion, useReducedMotion } from "framer-motion";
import { skills } from "@/data/resume";

const ROWS = Object.entries(skills); // [ "backend.ts", [...] ], etc.

export default function BetaCraft() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="craft" className="relative overflow-hidden border-t border-[#1c2621] py-28 sm:py-40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.6 }}
        className="mb-16 px-6 sm:mb-20 sm:px-10"
      >
        <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-[#556058]">
          02 — Craft
        </h2>
      </motion.div>

      <div className="flex flex-col gap-5 sm:gap-7">
        {ROWS.map(([category, items], rowIndex) => (
          <div key={category} className="group relative flex overflow-hidden">
            <div
              className={`flex shrink-0 items-center gap-8 pr-8 ${
                reduceMotion ? "" : "animate-[marquee_38s_linear_infinite]"
              } ${rowIndex % 2 === 1 ? "[animation-direction:reverse]" : ""} group-hover:[animation-play-state:paused]`}
            >
              {[...items, ...items, ...items].map((item, i) => (
                <span
                  key={`${item}-${i}`}
                  className="flex shrink-0 items-baseline gap-3 whitespace-nowrap"
                >
                  <span
                    className="font-bold leading-none tracking-tight text-[#3a4a41] transition-colors hover:text-[#e8efe9]"
                    style={{ fontSize: "clamp(1.5rem, 4vw, 2.75rem)" }}
                  >
                    {item}
                  </span>
                  <span className="font-mono text-xs text-[#556058]">
                    {category.replace(".ts", "").replace(".json", "")}
                  </span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-33.3333%); }
        }
      `}</style>
    </section>
  );
}
