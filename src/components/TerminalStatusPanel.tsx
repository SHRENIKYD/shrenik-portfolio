"use client";

import { useEffect, useRef, useState } from "react";
import { useMultiLineTypewriter } from "@/components/useMultiLineTypewriter";

// Kept to exactly 4 facts, on request: what I do, where I work,
// education, and total experience.
const STATUS_LINES: { cmd: string; output: string }[] = [
  { cmd: "whoami", output: "Senior Software Engineer" },
  { cmd: "current --project", output: "Claims Intelligence @ PCMI Corporation" },
  { cmd: "cat education.txt", output: "MCA · Nitte Meenakshi · CGPA 8.43" },
  { cmd: "uptime --career", output: "4 years, 10 months" },
];

function IstClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata",
      }).format(new Date());

    setTime(format());
    const id = setInterval(() => setTime(format()), 1000);
    return () => clearInterval(id);
  }, []);

  // render nothing until client mount to avoid build-time/runtime clock mismatch
  if (!time) return <span className="opacity-0">00:00:00</span>;
  return <span>{time} IST</span>;
}

function CycleLine({ pair, onDone }: { pair: { cmd: string; output: string }; onDone: () => void }) {
  const { rendered, activeIndex, done } = useMultiLineTypewriter(
    [`$ ${pair.cmd}`, pair.output],
    18,
    150
  );

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  return (
    <div className="min-h-[2.5rem]">
      <div className="text-[#556058]">
        {rendered[0]}
        {activeIndex === 0 && <span className="cursor-blink" />}
      </div>
      <div className="text-[#39ff8e]">
        {rendered[1]}
        {activeIndex === 1 && <span className="cursor-blink" />}
      </div>
    </div>
  );
}

export default function TerminalStatusPanel() {
  const [printed, setPrinted] = useState<{ cmd: string; output: string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const finished = printed.length >= STATUS_LINES.length;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [printed.length]);

  return (
    <div
      className={`flex h-56 flex-col rounded-lg border border-[#1c2621] bg-[#0d1310] overflow-hidden transition-shadow ${
        finished ? "glow-pulse" : ""
      }`}
    >
      <div className="flex items-center justify-between border-b border-[#1c2621] px-3 py-2 shrink-0">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        </div>
        <span className="font-mono text-[10px] text-[#556058]">
          <IstClock />
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto px-3 py-3 font-mono text-[11px] leading-relaxed space-y-2"
      >
        {printed.map((h, i) => {
          const isLast = i === printed.length - 1;
          return (
            <div key={i} className={finished && isLast ? "" : "opacity-60"}>
              <div className="text-[#556058]">$ {h.cmd}</div>
              <div className="text-[#39ff8e]">{h.output}</div>
            </div>
          );
        })}
        {!finished && (
          <CycleLine
            key={printed.length}
            pair={STATUS_LINES[printed.length]}
            onDone={() => setPrinted((p) => [...p, STATUS_LINES[p.length]])}
          />
        )}
      </div>
    </div>
  );
}
