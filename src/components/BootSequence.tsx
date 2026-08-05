"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { profile } from "@/data/resume";

const LINES: { text: string; delay: number }[] = [
  { text: "$ whoami", delay: 250 },
  { text: profile.name.toLowerCase().replace(" ", "."), delay: 500 },
  { text: "$ cat role.txt", delay: 700 },
  { text: profile.title, delay: 400 },
  { text: "$ ssh prod@iris-payroll --deploy zayzoon", delay: 700 },
  { text: "Authenticating... done", delay: 500 },
  { text: "Provisioning 20,000+ employers... done", delay: 700 },
  { text: "Rolling out on-demand pay... done", delay: 600 },
  { text: "$ open portfolio.exe", delay: 600 },
];

export default function BootSequence({ onDone }: { onDone: () => void }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    if (skip) return;
    if (visibleLines >= LINES.length) {
      const t = setTimeout(onDone, 550);
      return () => clearTimeout(t);
    }
    const t = setTimeout(
      () => setVisibleLines((v) => v + 1),
      LINES[visibleLines]?.delay ?? 400
    );
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleLines, skip]);

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
        <div className="w-full max-w-xl font-mono text-sm sm:text-base text-[#39ff8e]">
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
          <div className="mt-8 text-xs text-[#6b7a72] tracking-wide">
            click anywhere / press any key to skip
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
