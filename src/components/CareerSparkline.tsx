"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { timelineEvents } from "@/data/resume";

const START_YEAR = timelineEvents[0].year;
const END_YEAR = new Date().getFullYear();
const SPAN = END_YEAR - START_YEAR;

function pct(year: number) {
  return `${((year - START_YEAR) / SPAN) * 100}%`;
}

export default function CareerSparkline() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="relative pt-8 pb-10 select-none">
      <div className="relative h-px w-full bg-[#1c2621]">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
          className="absolute inset-y-0 left-0 h-px bg-gradient-to-r from-[#1c2621] via-[#39ff8e]/60 to-[#39ff8e]"
        />

        {timelineEvents.map((ev, i) => (
          <div
            key={ev.year}
            className="absolute -top-1.5 -translate-x-1/2"
            style={{ left: pct(ev.year) }}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
          >
            <button
              aria-label={ev.label}
              className={`h-3 w-3 rounded-full border-2 transition-colors cursor-pointer ${
                active === i
                  ? "border-[#39ff8e] bg-[#39ff8e] glow-pulse"
                  : "border-[#39ff8e]/70 bg-[#0a0e0c]"
              }`}
            />
            <div className="absolute left-1/2 top-4 -translate-x-1/2 whitespace-nowrap text-[10px] font-mono text-[#556058]">
              {ev.year}
            </div>

            {active === i && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-1/2 top-8 z-10 w-48 -translate-x-1/2 rounded-md border border-[#1c2621] bg-[#0d1310] px-3 py-2 text-left shadow-lg shadow-black/40"
              >
                <div className="font-mono text-xs text-[#39ff8e]">{ev.label}</div>
                <div className="mt-0.5 text-[11px] leading-snug text-[#8b978f]">
                  {ev.detail}
                </div>
              </motion.div>
            )}
          </div>
        ))}

        {/* "now" marker */}
        <div
          className="absolute -top-1.5 -translate-x-1/2"
          style={{ left: "100%" }}
        >
          <span className="block h-3 w-3 rounded-full bg-[#ff6ac1] glow-pulse" />
          <div className="absolute left-1/2 top-4 -translate-x-1/2 whitespace-nowrap text-[10px] font-mono text-[#ff6ac1]">
            now
          </div>
        </div>
      </div>
    </div>
  );
}
