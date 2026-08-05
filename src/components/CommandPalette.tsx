"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TABS } from "@/data/tabs";
import { profile } from "@/data/resume";
import { Search, ExternalLink, Download, ArrowRight } from "lucide-react";

interface Command {
  id: string;
  label: string;
  hint?: string;
  action: () => void;
}

export default function CommandPalette({
  open,
  onClose,
  onNavigate,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (tabId: string) => void;
}) {
  const [query, setQuery] = useState("");

  const commands: Command[] = useMemo(
    () => [
      ...TABS.map((t) => ({
        id: `nav-${t.id}`,
        label: `Open ${t.fileName}`,
        hint: "navigate",
        action: () => onNavigate(t.id),
      })),
      {
        id: "email",
        label: `Email ${profile.email}`,
        hint: "mailto",
        action: () => window.open(`mailto:${profile.email}`, "_self"),
      },
      {
        id: "linkedin",
        label: "Open LinkedIn profile",
        hint: "external",
        action: () => window.open(profile.linkedin, "_blank"),
      },
      {
        id: "github",
        label: "Open GitHub profile",
        hint: "external",
        action: () => window.open(profile.github, "_blank"),
      },
      {
        id: "resume",
        label: "Download resume PDF",
        hint: "download",
        action: () => {
          const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
          window.open(`${base}/${profile.resumeFile}`, "_blank");
        },
      },
    ],
    [onNavigate]
  );

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm pt-24 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-lg border border-[#1c2621] bg-[#0d1310] shadow-2xl shadow-black/50"
          >
            <div className="flex items-center gap-2 border-b border-[#1c2621] px-3 py-2.5">
              <Search size={15} className="text-[#39ff8e]" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search…"
                className="w-full bg-transparent font-mono text-sm text-[#c9d1d9] outline-none placeholder:text-[#556058]"
              />
              <kbd className="rounded border border-[#1c2621] px-1.5 py-0.5 text-[10px] text-[#556058]">
                esc
              </kbd>
            </div>
            <div className="max-h-72 overflow-y-auto py-1">
              {filtered.length === 0 && (
                <div className="px-3 py-6 text-center text-sm text-[#556058] font-mono">
                  no matches
                </div>
              )}
              {filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    c.action();
                    onClose();
                  }}
                  className="flex w-full items-center justify-between px-3 py-2 text-left font-mono text-sm text-[#c9d1d9] hover:bg-[#132018]"
                >
                  <span className="flex items-center gap-2">
                    <ArrowRight size={13} className="text-[#39ff8e]" />
                    {c.label}
                  </span>
                  {c.hint === "external" && (
                    <ExternalLink size={13} className="text-[#556058]" />
                  )}
                  {c.hint === "download" && (
                    <Download size={13} className="text-[#556058]" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
