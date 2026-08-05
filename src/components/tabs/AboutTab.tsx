"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  profile,
  education,
  traits,
  languagesKnown,
  impactStats,
  fieldNotes,
} from "@/data/resume";
import Gutter from "@/components/Gutter";
import Counter from "@/components/Counter";
import CareerSparkline from "@/components/CareerSparkline";
import SkillConstellation from "@/components/SkillConstellation";
import AvatarReveal from "@/components/AvatarReveal";
import TechOrbit from "@/components/TechOrbit";
import TerminalStatusPanel from "@/components/TerminalStatusPanel";
import CodeMinimap from "@/components/CodeMinimap";
import { withBasePath } from "@/lib/basePath";
import { useMultiLineTypewriter } from "@/components/useMultiLineTypewriter";
import { GraduationCap, Sparkles, Languages, MapPin, Terminal } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" as const },
  }),
};

const FIELD_LINES = [
  `name: "${profile.name}",`,
  `title: "${profile.title}",`,
  `location: "${profile.location}",`,
];
const FIELD_KEYS: (keyof typeof fieldNotes)[] = ["name", "title", "location"];

function TypedFields({ onCompiled }: { onCompiled: () => void }) {
  const { rendered, activeIndex, done } = useMultiLineTypewriter(FIELD_LINES, 20, 200);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(onCompiled, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  return (
    <>
      <div className="pl-4 sm:pl-6 mt-2 border-l-2 border-[#1c2621] font-mono text-[15px] leading-8">
        {FIELD_LINES.map((_, i) => {
          const text = rendered[i];
          const [key, ...rest] = text.split(/:(.*)/);
          const isActive = activeIndex === i;
          return (
            <div key={i} className="group relative">
              <span className="text-[#6cb6ff]">{key}</span>
              {rest.length > 0 && (
                <>
                  <span className="text-[#c9d1d9]">:</span>
                  <span className="text-[#ffb454]">{rest.join("")}</span>
                </>
              )}
              {isActive && <span className="cursor-blink" />}
              {done && (
                <span className="ml-3 hidden sm:inline text-xs text-[#3a4a41] opacity-0 group-hover:opacity-100 group-hover:text-[#556058] transition-opacity">
                  {fieldNotes[FIELD_KEYS[i]]}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-2xl sm:text-3xl font-bold text-[#ffb454] mt-1">{"}"}</div>

      {done && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 font-mono text-xs text-[#556058] flex items-center gap-1.5"
        >
          <Terminal size={12} />
          $ tsc --noEmit about.tsx …{" "}
          <span className="text-[#39ff8e]">compiled successfully</span>
        </motion.div>
      )}
    </>
  );
}

function RestOfAbout() {
  const [verbose, setVerbose] = useState(true);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 max-w-2xl"
      >
        <div className="flex items-center justify-between gap-3 mb-2">
          <span className="font-mono text-xs uppercase tracking-widest text-[#6b7a72]">
            summary
          </span>
          <button
            onClick={() => setVerbose((v) => !v)}
            className="flex items-center gap-1.5 rounded-full border border-[#1c2621] px-2.5 py-1 font-mono text-[10px] text-[#8b978f] hover:border-[#39ff8e]/40 hover:text-[#39ff8e] transition-colors"
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                verbose ? "bg-[#39ff8e]" : "bg-[#556058]"
              }`}
            />
            verbose: {verbose ? "true" : "false"}
          </button>
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={verbose ? "long" : "short"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-[15px] sm:text-base leading-relaxed text-[#a9b6ae]"
          >
            {verbose ? profile.summary : profile.summaryShort}
          </motion.p>
        </AnimatePresence>
      </motion.div>

      {/* impact stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {impactStats.map((s) => (
          <div
            key={s.label}
            className="rounded-lg border border-[#1c2621] bg-[#0d1310] px-3 py-4 text-center hover:border-[#39ff8e]/40 transition-colors"
          >
            <div className="font-mono text-xl sm:text-2xl font-bold text-[#39ff8e] text-glow">
              <Counter value={s.value} suffix={s.suffix} />
            </div>
            <div className="mt-1 text-[11px] text-[#8b978f] leading-tight">
              {s.label}
            </div>
          </div>
        ))}
      </motion.div>

      {/* career sparkline */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-6"
      >
        <div className="font-mono text-xs uppercase tracking-widest text-[#6b7a72] mb-1">
          career, at a glance
        </div>
        <CareerSparkline />
      </motion.div>

      {/* education */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4"
      >
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#6b7a72] mb-3">
          <GraduationCap size={14} className="text-[#39ff8e]" />
          education
        </div>
        <div className="rounded-lg border border-[#1c2621] bg-[#0d1310] p-4">
          <div className="font-semibold text-[#e8efe9]">{education.school}</div>
          <div className="text-sm text-[#a9b6ae] mt-1">
            {education.degree} · CGPA {education.cgpa}
          </div>
          <div className="text-xs text-[#6b7a72] mt-1 flex items-center gap-1">
            <MapPin size={11} /> {education.location} · {education.period}
          </div>
        </div>
      </motion.div>

      {/* traits */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-8"
      >
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#6b7a72] mb-3">
          <Sparkles size={14} className="text-[#39ff8e]" />
          traits
        </div>
        <ul className="space-y-2">
          {traits.map((t) => (
            <li key={t} className="flex gap-2 text-sm text-[#a9b6ae] leading-relaxed">
              <span className="text-[#39ff8e]">▸</span>
              {t}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* languages */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 mb-4"
      >
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#6b7a72] mb-3">
          <Languages size={14} className="text-[#39ff8e]" />
          languages
        </div>
        <div className="flex gap-2 flex-wrap">
          {languagesKnown.map((l) => (
            <span
              key={l}
              className="rounded-full border border-[#1c2621] bg-[#0d1310] px-3 py-1 text-xs font-mono text-[#a9b6ae]"
            >
              {l}
            </span>
          ))}
        </div>
      </motion.div>
    </>
  );
}

export default function AboutTab() {
  const [compiled, setCompiled] = useState(false);

  return (
    <div className="flex">
      <Gutter />
      <div className="relative flex-1 min-w-0 px-4 sm:px-8 py-8 max-w-3xl">
        <motion.div
          initial="hidden"
          animate="show"
          custom={0}
          variants={fadeUp}
          className="font-mono text-sm text-[#6b7a72] mb-2"
        >
          <span className="text-[#556058]">01</span> // profile
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          custom={1}
          variants={fadeUp}
          className="flex items-start gap-4 sm:gap-5"
        >
          <AvatarReveal src={withBasePath(profile.avatar)} alt={profile.name} />

          <div className="min-w-0">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#e8efe9]">
              <span className="text-[#556058] font-mono text-xl mr-1">const</span>{" "}
              <span className="text-[#6cb6ff]">shrenik</span>
              <span className="text-[#c9d1d9]"> = </span>
              <span className="text-[#ffb454]">{"{"}</span>
            </h1>
            <TypedFields onCompiled={() => setCompiled(true)} />
          </div>
        </motion.div>

        {compiled && <RestOfAbout />}
      </div>

      {/* absorbs leftover width on wide viewports so the rail + minimap
          hug the right edge instead of leaving dead space past them */}
      <div className="flex-1" />

      <aside className="hidden lg:flex lg:sticky lg:top-0 lg:self-start w-64 shrink-0 flex-col gap-4 border-l border-[#1c2621] px-4 py-8">
        <div>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[#556058]">
            stack.orbit
          </div>
          <TechOrbit />
        </div>

        <div className="rounded-lg border border-[#1c2621] bg-[#0d1310] p-3">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[#556058]">
            stack.map
          </div>
          <SkillConstellation />
        </div>

        <TerminalStatusPanel />
      </aside>

      <CodeMinimap />
    </div>
  );
}
