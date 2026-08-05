"use client";

import { motion } from "framer-motion";
import { profile, education, traits, languagesKnown, impactStats } from "@/data/resume";
import Gutter from "@/components/Gutter";
import { GraduationCap, Sparkles, Languages, MapPin } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" as const },
  }),
};

export default function AboutTab() {
  return (
    <div className="flex">
      <Gutter />
      <div className="flex-1 min-w-0 px-4 sm:px-8 py-8 max-w-3xl">
        <motion.div
          initial="hidden"
          animate="show"
          custom={0}
          variants={fadeUp}
          className="font-mono text-sm text-[#6b7a72] mb-2"
        >
          <span className="text-[#556058]">01</span> // profile
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="show"
          custom={1}
          variants={fadeUp}
          className="text-3xl sm:text-4xl font-bold tracking-tight text-[#e8efe9]"
        >
          <span className="text-[#556058] font-mono text-xl mr-1">const</span>{" "}
          <span className="text-[#6cb6ff]">shrenik</span>
          <span className="text-[#c9d1d9]"> = </span>
          <span className="text-[#ffb454]">{"{"}</span>
        </motion.h1>

        <motion.div
          initial="hidden"
          animate="show"
          custom={2}
          variants={fadeUp}
          className="pl-4 sm:pl-6 mt-2 border-l-2 border-[#1c2621] font-mono text-[15px] leading-8"
        >
          <div>
            <span className="text-[#6cb6ff]">name</span>
            <span className="text-[#c9d1d9]">: </span>
            <span className="text-[#ffb454]">&quot;{profile.name}&quot;</span>,
          </div>
          <div>
            <span className="text-[#6cb6ff]">title</span>
            <span className="text-[#c9d1d9]">: </span>
            <span className="text-[#ffb454]">&quot;{profile.title}&quot;</span>,
          </div>
          <div className="flex items-start gap-1">
            <span className="text-[#6cb6ff]">location</span>
            <span className="text-[#c9d1d9]">: </span>
            <span className="text-[#ffb454]">&quot;{profile.location}&quot;</span>,
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          custom={3}
          variants={fadeUp}
          className="text-2xl sm:text-3xl font-bold text-[#ffb454] mt-1"
        >
          {"}"}
        </motion.div>

        <motion.p
          initial="hidden"
          animate="show"
          custom={4}
          variants={fadeUp}
          className="mt-8 text-[15px] sm:text-base leading-relaxed text-[#a9b6ae] max-w-2xl"
        >
          {profile.summary}
        </motion.p>

        {/* impact stats */}
        <motion.div
          initial="hidden"
          animate="show"
          custom={5}
          variants={fadeUp}
          className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {impactStats.map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-[#1c2621] bg-[#0d1310] px-3 py-4 text-center hover:border-[#39ff8e]/40 transition-colors"
            >
              <div className="font-mono text-xl sm:text-2xl font-bold text-[#39ff8e] text-glow">
                {s.value.toLocaleString()}
                {s.suffix}
              </div>
              <div className="mt-1 text-[11px] text-[#8b978f] leading-tight">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* education */}
        <motion.div
          initial="hidden"
          animate="show"
          custom={6}
          variants={fadeUp}
          className="mt-10"
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
          initial="hidden"
          animate="show"
          custom={7}
          variants={fadeUp}
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
          initial="hidden"
          animate="show"
          custom={8}
          variants={fadeUp}
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
      </div>
    </div>
  );
}
