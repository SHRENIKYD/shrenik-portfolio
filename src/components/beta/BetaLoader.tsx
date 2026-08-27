"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Entry gate for /beta, after activetheory.net's loader: a blob of ASCII
// slashes with the load percentage burned into the middle, which resolves
// into a circular hatched emblem with ">>>" — click (or wait a beat) to
// enter. Pure DOM/text, no canvas. Skipped entirely for reduced-motion
// users and for return visits within the same session.

const ROWS = 13;
const MAX_COLS = 40;

function buildBlob(): string[] {
  const rows: string[] = [];
  for (let r = 0; r < ROWS; r++) {
    // circle-ish envelope: row width follows sqrt(1 - (2r/N - 1)^2)
    const t = (2 * r) / (ROWS - 1) - 1;
    const width = Math.max(6, Math.round(Math.sqrt(Math.max(0, 1 - t * t)) * MAX_COLS));
    let s = "";
    for (let c = 0; c < width; c++) {
      const roll = Math.random();
      s += roll < 0.08 ? String((Math.random() * 10) | 0) : "/";
    }
    rows.push(s);
  }
  return rows;
}

export default function BetaLoader() {
  const [gone, setGone] = useState(true); // default hidden until we decide to show
  const [phase, setPhase] = useState<"load" | "ready">("load");
  const [pct, setPct] = useState(0);
  const blob = useMemo(buildBlob, []);
  const doneRef = useRef(false);

  // decide on mount whether to show at all
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem("beta-loader-seen");
    if (!reduce && !seen) setGone(false);
  }, []);

  // fake-but-honest progress: eases toward 100 over ~1.6s
  useEffect(() => {
    if (gone || phase !== "load") return;
    const id = setInterval(() => {
      setPct((p) => {
        const next = p + (100 - p) * 0.08 + 0.9;
        if (next >= 100) {
          clearInterval(id);
          setPhase("ready");
          return 100;
        }
        return next;
      });
    }, 30);
    return () => clearInterval(id);
  }, [gone, phase]);

  // auto-enter shortly after the emblem appears; click enters immediately
  useEffect(() => {
    if (gone || phase !== "ready") return;
    const t = setTimeout(dismiss, 2200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gone, phase]);

  function dismiss() {
    if (doneRef.current) return;
    doneRef.current = true;
    sessionStorage.setItem("beta-loader-seen", "1");
    setGone(true);
  }

  const shown = Math.min(99, Math.round(pct));

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          onClick={phase === "ready" ? dismiss : undefined}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#030507]"
          style={{ cursor: phase === "ready" ? "pointer" : "default" }}
        >
          <AnimatePresence mode="wait">
            {phase === "load" ? (
              <motion.div
                key="blob"
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35 }}
                className="relative select-none font-mono text-[11px] leading-[1.35] tracking-[0.08em] text-[#5f7d8c]/60"
              >
                {blob.map((row, i) => (
                  <div key={i} className="text-center whitespace-pre">
                    {row}
                  </div>
                ))}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <span className="bg-[#030507] px-2 font-mono text-xl tracking-[0.15em] text-[#9fc4d4]">
                    /{shown}
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.button
                key="emblem"
                type="button"
                aria-label="Enter site"
                onClick={dismiss}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex h-56 w-56 items-center justify-center rounded-full sm:h-64 sm:w-64"
                style={{
                  border: "1px solid rgba(120,170,190,0.55)",
                  boxShadow:
                    "0 0 40px rgba(90,150,180,0.25), inset 0 0 60px rgba(60,110,140,0.12)",
                }}
              >
                {/* hatched interior */}
                <span
                  aria-hidden
                  className="absolute inset-4 rounded-full opacity-60"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(115deg, rgba(110,160,180,0.35) 0 1px, transparent 1px 8px)",
                    maskImage: "radial-gradient(circle, black 65%, transparent 72%)",
                    WebkitMaskImage: "radial-gradient(circle, black 65%, transparent 72%)",
                  }}
                />
                <motion.span
                  animate={{ x: [0, 6, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative font-mono text-2xl tracking-[0.3em] text-[#bfe3ef]"
                >
                  {">>>"}
                </motion.span>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
