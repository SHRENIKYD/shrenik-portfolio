"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { profile, education, traits, impactStats } from "@/data/resume";

export default function BetaAbout() {
  return (
    <section id="about" className="relative border-t border-[#1c2621] px-6 py-28 sm:px-10 sm:py-40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.6 }}
        className="mb-16 sm:mb-20"
      >
        <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-[#556058]">
          04 — About
        </h2>
      </motion.div>

      <div className="grid gap-16 lg:grid-cols-[1fr_20rem] lg:gap-12">
        <div>
          <motion.h3
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl font-bold leading-[1.1] tracking-tight text-[#e8efe9]"
            style={{ fontSize: "clamp(1.75rem, 4.2vw, 3.25rem)", textWrap: "balance" }}
          >
            Full-stack, systems-minded, and quick to pick up whatever the
            problem calls for.
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-8 max-w-xl text-base leading-relaxed text-[#8b978f]"
          >
            {profile.summary}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col gap-8"
        >
          <div>
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#556058]">
              Traits
            </div>
            <ul className="space-y-2.5">
              {traits.map((t) => (
                <li key={t} className="flex gap-2 text-sm leading-relaxed text-[#8b978f]">
                  <span className="shrink-0 text-[#39ff8e]">—</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#556058]">
              <GraduationCap size={12} />
              Education
            </div>
            <div className="text-sm text-[#c9d1d9]">{education.school}</div>
            <div className="mt-1 text-xs text-[#6b7a72]">
              {education.degree} · CGPA {education.cgpa} · {education.period}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-20 grid grid-cols-2 gap-6 border-t border-[#1c2621] pt-10 sm:mt-28 sm:grid-cols-4 sm:gap-8"
      >
        {impactStats.map((s) => (
          <div key={s.label}>
            <div className="font-mono text-3xl font-bold text-[#39ff8e] sm:text-4xl">
              {s.value}
              {s.suffix}
            </div>
            <div className="mt-1 text-xs leading-tight text-[#8b978f]">{s.label}</div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
