"use client";

import { profile } from "@/data/resume";
import { GitBranch, Mail, Phone, Command } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";

export default function StatusBar({ onOpenPalette }: { onOpenPalette: () => void }) {
  return (
    <div className="flex items-center justify-between border-t border-[#1c2621] bg-[#0d1310] px-3 py-1.5 text-[11px] font-mono text-[#8b978f]">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1 text-[#39ff8e]">
          <GitBranch size={12} />
          main
        </span>
        <span className="hidden sm:inline">4+ yrs exp</span>
        <button
          onClick={onOpenPalette}
          className="hidden sm:flex items-center gap-1 rounded border border-[#1c2621] px-1.5 py-0.5 hover:border-[#39ff8e] hover:text-[#39ff8e] transition-colors"
        >
          <Command size={11} />
          K to search
        </button>
      </div>
      <div className="flex items-center gap-3">
        <a
          href={`mailto:${profile.email}`}
          className="flex items-center gap-1 hover:text-[#39ff8e] transition-colors"
        >
          <Mail size={12} />
          <span className="hidden sm:inline">{profile.email}</span>
        </a>
        <a
          href={`tel:${profile.phone.replace(/\s/g, "")}`}
          className="hidden md:flex items-center gap-1 hover:text-[#39ff8e] transition-colors"
        >
          <Phone size={12} />
          {profile.phone}
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noreferrer"
          className="hover:text-[#39ff8e] transition-colors"
          aria-label="LinkedIn"
        >
          <LinkedinIcon size={13} />
        </a>
        <a
          href={profile.github}
          target="_blank"
          rel="noreferrer"
          className="hover:text-[#39ff8e] transition-colors"
          aria-label="GitHub"
        >
          <GithubIcon size={13} />
        </a>
      </div>
    </div>
  );
}
