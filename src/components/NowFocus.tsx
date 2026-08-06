"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile, jobs, devQuotes } from "@/data/resume";

// Replaces the old stack.orbit widget — that slot already had a neighbor
// (stack.map) covering "here are my skills," so this shows something the
// rest of the sidebar doesn't: what's currently being worked on (sourced
// from resume.ts, not duplicated here) plus a rotating personality quip,
// `fortune`-style. Plain DOM/CSS + a timed fade — no canvas, no physics.

const ROTATE_MS = 4500;

export default function NowFocus() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % devQuotes.length), ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  const currentJob = jobs[0];
  const currentProject = currentJob.projects[0];

  return (
    <div className="font-mono text-xs leading-relaxed">
      <div className="text-[#556058]">
        <span className="text-[#39ff8e]">$</span> cat focus.txt
      </div>
      <div className="mt-1.5 text-[#c9d1d9]">
        {profile.title} <span className="text-[#556058]">@</span> {currentJob.company}
      </div>
      <div className="text-[#8b978f]">
        building <span className="text-[#6cb6ff]">{currentProject.name}</span>
      </div>

      <div className="mt-4 text-[#556058]">
        <span className="text-[#39ff8e]">$</span> fortune --dev
      </div>
      <div className="mt-1.5 min-h-[2.5rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            className="text-[#ffb454]"
          >
            {"// "}
            {devQuotes[i]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
