"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { profile } from "@/data/resume";
import IsometricDesk from "@/components/IsometricDesk";

const LINES: { text: string; delay: number }[] = [
  { text: "$ whoami", delay: 250 },
  { text: profile.name.toLowerCase().replace(" ", "."), delay: 500 },
  { text: "$ cat role.txt", delay: 700 },
  { text: profile.title, delay: 400 },
  { text: "$ ssh prod@pcmi-corp --deploy stack", delay: 700 },
  { text: "Authenticating... done", delay: 500 },
  { text: "Provisioning Angular 21 + .NET Core... done", delay: 700 },
  { text: "Wiring up Azure AI Services... done", delay: 600 },
  { text: "$ open portfolio.exe", delay: 600 },
];

const DESK_BEAT_MS = 1400;

export default function BootSequence({ onDone }: { onDone: () => void }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [phase, setPhase] = useState<"type" | "desk">("type");
  const [skip, setSkip] = useState(false);

  // Terminal typing, line by line.
  useEffect(() => {
    if (skip || phase !== "type") return;
    if (visibleLines >= LINES.length) {
      const t = setTimeout(() => setPhase("desk"), 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(
      () => setVisibleLines((v) => v + 1),
      LINES[visibleLines]?.delay ?? 400
    );
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleLines, phase, skip]);

  // One-beat "workstation" reveal after the terminal finishes, then hand off.
  useEffect(() => {
    if (skip || phase !== "desk") return;
    const t = setTimeout(onDone, DESK_BEAT_MS);
    return () => clearTimeout(t);
  }, [phase, skip, onDone]);

  useEffect(() => {
    if (skip) onDone();
  }, [skip, onDone]);

  useEffect(() => {
    const handler = () => setSkip(true);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0e0c] px-4"
        onClick={() => setSkip(true)}
      >
        <AnimatePresence mode="wait">
          {phase === "type" ? (
            <motion.div
              key="type"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-xl font-mono text-sm sm:text-base text-[#39ff8e]"
            >
              {LINES.slice(0, visibleLines).map((line, i) => (
                <div key={i} className="mb-1 leading-relaxed">
                  {line.text.startsWith("$") ? (
                    <span>
                      <span className="text-[#6b7a72]">{"> "}</span>
                      {line.text}
                    </span>
                  ) : (
                    <span className="text-[#c9d1d9]">{line.text}</span>
                  )}
                </div>
              ))}
              <span className="cursor-blink" />
            </motion.div>
          ) : (
            <motion.div
              key="desk"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center gap-4"
            >
              <IsometricDesk variant="hero" className="h-64 w-96 max-w-full" />
              <div className="font-mono text-xs text-[#556058] tracking-wide">
                environment ready
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="fixed bottom-8 text-xs text-[#6b7a72] tracking-wide">
          click anywhere / press any key to skip
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
