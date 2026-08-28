"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/resume";
import { withBasePath } from "@/lib/basePath";

// "WHAT ARE YOU LOOKING FOR?" wayfinding block + the "ask me anything"
// pill, after activetheory.net/work. The arrow links route to real
// destinations on this page (or the résumé file); the pill is an honest
// mailto — no fake AI chat on a static site.

const LINKS: { label: string; href: string }[] = [
  { label: "FULL-STACK WORK", href: "#work" },
  { label: "THE JOB HISTORY", href: "#experience" },
  { label: "SKILLS / TOOLING", href: "#craft" },
  { label: "THE PERSON BEHIND IT", href: "#about" },
  { label: "A RÉSUMÉ", href: "resume" },
  { label: "A CONVERSATION", href: "#contact" },
];

export default function BetaWhatFor() {
  const goTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative px-6 py-24 sm:px-10 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl"
      >
        <div className="mb-8 font-mono text-sm uppercase tracking-[0.2em] text-[#8b978f]">
          What are you looking for?
        </div>

        <div className="flex flex-col gap-4">
          {LINKS.map((l, i) => {
            const isResume = l.href === "resume";
            const common =
              "group flex w-fit items-baseline gap-3 font-mono text-lg sm:text-2xl text-[#7f9bd4] transition-colors hover:text-[#39ff8e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#39ff8e]";
            const inner = (
              <>
                <span className="text-[#556d9a] transition-transform group-hover:translate-x-1">
                  {"->"}
                </span>
                {l.label}
              </>
            );
            return (
              <motion.div
                key={l.label}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                {isResume ? (
                  <a
                    href={withBasePath(`/${profile.resumeFile}`)}
                    download
                    className={common}
                  >
                    {inner}
                  </a>
                ) : (
                  <button type="button" onClick={() => goTo(l.href)} className={common}>
                    {inner}
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.a
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          href={`mailto:${profile.email}?subject=Question%20from%20your%20portfolio`}
          className="mt-14 inline-flex items-center rounded-full border px-8 py-4 font-mono text-sm tracking-[0.15em] text-[#8b978f] backdrop-blur-sm transition-all hover:text-[#bfe3ef] sm:mt-16"
          style={{
            borderColor: "rgba(140,190,210,0.3)",
            background: "rgba(5,10,14,0.4)",
            boxShadow: "0 0 24px rgba(90,150,180,0.12)",
          }}
        >
          ASK ME ANYTHING<span className="cursor-blink ml-1" />
        </motion.a>
      </motion.div>
    </section>
  );
}
