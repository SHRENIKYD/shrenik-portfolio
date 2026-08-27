"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { profile } from "@/data/resume";

const LINKS = [
  { id: "work", label: "Work", n: "01" },
  { id: "craft", label: "Craft", n: "02" },
  { id: "about", label: "About", n: "03" },
  { id: "contact", label: "Contact", n: "04" },
];

export default function BetaNav() {
  const [open, setOpen] = useState(false);

  // Escape closes the overlay, and body scroll locks while it's open —
  // standard behavior for a full-screen nav takeover.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const goTo = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 sm:px-10 sm:py-7">
        <Link
          href="/"
          className="font-mono text-sm font-medium tracking-[0.2em] text-[#e8efe9] transition-colors hover:text-[#39ff8e]"
        >
          SHRENIK.YD
        </Link>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#c9d1d9] transition-colors hover:text-[#39ff8e]"
        >
          {open ? "Close" : "Menu"}
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-30 flex flex-col justify-center bg-[#080b09] px-6 sm:px-10"
          >
            <nav className="flex flex-col gap-2">
              {LINKS.map((l, i) => (
                <motion.button
                  key={l.id}
                  type="button"
                  onClick={() => goTo(l.id)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: "easeOut" }}
                  className="group flex items-baseline gap-4 border-b border-[#1c2621] py-4 text-left transition-colors hover:border-[#39ff8e]/40 sm:gap-6"
                >
                  <span className="font-mono text-xs text-[#556058]">{l.n}</span>
                  <span
                    className="text-[13vw] font-bold leading-[0.95] tracking-tight text-[#3a4a41] transition-colors group-hover:text-[#e8efe9] sm:text-6xl md:text-7xl"
                    style={{ textWrap: "balance" }}
                  >
                    {l.label}
                  </span>
                  <ArrowUpRight
                    size={28}
                    className="ml-auto shrink-0 -translate-x-2 text-[#39ff8e] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                  />
                </motion.button>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-2 font-mono text-xs text-[#556058]"
            >
              <span>{profile.email}</span>
              <a href={profile.github} className="hover:text-[#39ff8e]" target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a
                href={profile.linkedin}
                className="hover:text-[#39ff8e]"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              <Link href="/" className="hover:text-[#39ff8e]">
                ← back to the IDE version
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
