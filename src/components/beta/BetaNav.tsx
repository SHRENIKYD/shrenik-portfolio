"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { profile } from "@/data/resume";

const LINKS = [
  { id: "experience", label: "Experience", n: "01" },
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
          className="hidden font-mono text-sm font-medium tracking-[0.2em] text-[#e8efe9] transition-colors hover:text-[#39ff8e] sm:block"
        >
          SHRENIK.YD
        </Link>

        {/* centered pill nav, after activetheory.net */}
        <div
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-4 rounded-full border px-6 py-2.5 backdrop-blur-md sm:gap-6 sm:px-8 sm:py-3"
          style={{
            borderColor: "rgba(140,190,210,0.28)",
            background: "rgba(5,10,14,0.55)",
            boxShadow:
              "0 0 24px rgba(90,150,180,0.18), inset 0 0 18px rgba(60,110,140,0.08)",
          }}
        >
          <button
            type="button"
            onClick={() => goTo("work")}
            className="font-mono text-xs uppercase tracking-[0.25em] text-[#c9d1d9] transition-colors hover:text-[#39ff8e]"
          >
            Work
          </button>
          <span aria-hidden className="h-px w-8 bg-[#3a4a55] sm:w-12" />
          <button
            type="button"
            onClick={() => goTo("contact")}
            className="font-mono text-xs uppercase tracking-[0.25em] text-[#c9d1d9] transition-colors hover:text-[#39ff8e]"
          >
            Contact
          </button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="ml-auto flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#c9d1d9] transition-colors hover:text-[#39ff8e]"
        >
          <span className="hidden sm:inline">{open ? "Close" : "Menu"}</span>
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
