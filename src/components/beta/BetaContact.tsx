"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { profile } from "@/data/resume";
import { withBasePath } from "@/lib/basePath";

const LINKS = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s+/g, "")}` },
  { label: "LinkedIn", value: "linkedin.com/in/shrenik-yd", href: profile.linkedin },
  { label: "GitHub", value: "github.com/shrenikyd", href: profile.github },
];

export default function BetaContact() {
  return (
    <section
      id="contact"
      className="relative flex min-h-screen flex-col justify-center border-t border-[#1c2621] px-6 py-28 sm:px-10"
    >
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.7 }}
        className="max-w-3xl font-bold leading-[0.95] tracking-[-0.02em] text-[#e8efe9]"
        style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)", textWrap: "balance" }}
      >
        Open to interesting problems.{" "}
        <span className="text-[#39ff8e]">Let&apos;s talk.</span>
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-16 grid gap-6 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4"
      >
        {LINKS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target={l.href.startsWith("http") ? "_blank" : undefined}
            rel={l.href.startsWith("http") ? "noreferrer" : undefined}
            className="group flex flex-col gap-2 border-t border-[#1c2621] pt-4 transition-colors hover:border-[#39ff8e]/40"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#556058]">
              {l.label}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-[#c9d1d9] transition-colors group-hover:text-[#39ff8e]">
              {l.value}
              <ArrowUpRight
                size={13}
                className="-translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
              />
            </span>
          </a>
        ))}
      </motion.div>

      <motion.a
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        href={withBasePath(`/${profile.resumeFile}`)}
        download
        className="mt-16 inline-flex w-fit items-center gap-2 rounded-full border border-[#39ff8e]/40 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-[#39ff8e] transition-colors hover:bg-[#39ff8e]/10 sm:mt-20"
      >
        Download résumé
        <ArrowUpRight size={14} />
      </motion.a>

      <div className="mt-24 flex flex-wrap items-center justify-between gap-4 border-t border-[#1c2621] pt-6 font-mono text-[11px] text-[#556058] sm:mt-32">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>built with Next.js — experimental beta</span>
      </div>
    </section>
  );
}
