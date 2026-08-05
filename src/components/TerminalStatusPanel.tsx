"use client";

import { useEffect, useRef, useState } from "react";
import { useMultiLineTypewriter } from "@/components/useMultiLineTypewriter";

const STATUS_LINES: { cmd: string; output: string }[] = [
  { cmd: "whoami", output: "shrenik — Senior Software Engineer" },
  { cmd: "current --project", output: "PCMI Corporation @ Impetus Technologies" },
  { cmd: "cat mood.txt", output: "shipping > talking about shipping" },
  { cmd: "uptime --career", output: "4+ years, 2 companies, 0 gaps" },
  { cmd: "git log --oneline -1", output: "led Zayzoon on-demand-pay integration" },
  { cmd: "stack --frontend", output: "Angular 21, Knockout.js" },
  { cmd: "stack --backend", output: ".NET Core, VB.NET, C#" },
  { cmd: "cat education.txt", output: "MCA · Nitte Meenakshi · CGPA 8.43" },
  { cmd: "ping recruiter", output: "usually responds within a day" },
  { cmd: "echo $LOCATION", output: "Bengaluru, IST" },
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

function CycleLine({ cycleKey, onDone }: { cycleKey: number; onDone: (pair: { cmd: string; output: string }) => void }) {
  const pair = STATUS_LINES[cycleKey % STATUS_LINES.length];
  const { rendered, activeIndex, done } = useMultiLineTypewriter(
    [`$ ${pair.cmd}`, pair.output],
    18,
    150
  );

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => onDone(pair), 1400);
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

const MAX_HISTORY = 24;

export default function TerminalStatusPanel() {
  const [cycle, setCycle] = useState(0);
  const [history, setHistory] = useState<{ cmd: string; output: string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [history.length]);

  return (
    <div className="flex flex-1 min-h-0 flex-col rounded-lg border border-[#1c2621] bg-[#0d1310] overflow-hidden">
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
        {history.map((h, i) => (
          <div key={i} className="opacity-60">
            <div className="text-[#556058]">$ {h.cmd}</div>
            <div className="text-[#39ff8e]">{h.output}</div>
          </div>
        ))}
        <CycleLine
          key={cycle}
          cycleKey={cycle}
          onDone={(pair) => {
            setHistory((h) => [...h, pair].slice(-MAX_HISTORY));
            setCycle((c) => c + 1);
          }}
        />
      </div>
    </div>
  );
}
