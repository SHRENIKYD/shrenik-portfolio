"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { profile } from "@/data/resume";

const NAME_WORDS = profile.name.split(" ");

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};
const word = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function BetaHero() {
  const stageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const stage = stageRef.current;
    const text = textRef.current;
    if (!stage || !text) return;
    const onMove = (e: MouseEvent) => {
      const r = stage.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      text.style.transform = `translate(${px * -14}px, ${py * -10}px)`;
    };
    const onLeave = () => {
      text.style.transform = "translate(0px, 0px)";
    };
    stage.addEventListener("mousemove", onMove);
    stage.addEventListener("mouseleave", onLeave);
    return () => {
      stage.removeEventListener("mousemove", onMove);
      stage.removeEventListener("mouseleave", onLeave);
    };
  }, [reduceMotion]);

  return (
    <section
      ref={stageRef}
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 sm:px-10"
    >
      <div ref={textRef} style={{ transition: "transform 120ms ease-out" }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[#6b7a72] sm:mb-6"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#39ff8e] shadow-[0_0_10px_#39ff8e]" />
          {profile.title} · {profile.location.split(",")[0]}
        </motion.div>

        <motion.h1
          variants={container}
          initial="hidden"
          animate="show"
          className="text-[15vw] font-bold leading-[0.86] tracking-[-0.03em] text-[#e8efe9] sm:text-[11vw] lg:text-[9.5vw]"
        >
          {NAME_WORDS.map((w, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span variants={word} className="inline-block">
                {w}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85 }}
          className="mt-8 max-w-xl text-base leading-relaxed text-[#8b978f] sm:mt-10 sm:text-lg"
        >
          {profile.summaryShort}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.3 }}
        className="absolute bottom-8 left-6 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-[#556058] sm:bottom-10 sm:left-10"
      >
        <ArrowDown size={14} className="animate-bounce" />
        scroll
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.3 }}
        className="absolute bottom-8 right-6 font-mono text-[11px] uppercase tracking-[0.25em] text-[#556058] sm:bottom-10 sm:right-10"
      >
        beta build
      </motion.div>
    </section>
  );
}
