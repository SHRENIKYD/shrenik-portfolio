"use client";

import { TABS, langColor } from "@/data/tabs";
import { profile } from "@/data/resume";
import {
  FileCode2,
  FileJson2,
  FileTerminal,
  Network,
  User,
  ChevronDown,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";

const iconFor = (lang: string) => {
  switch (lang) {
    case "tsx":
      return User;
    case "ts":
      return FileCode2;
    case "json":
      return FileJson2;
    case "sh":
      return FileTerminal;
    case "diagram":
      return Network;
    default:
      return FileCode2;
  }
};

export default function Sidebar({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="hidden md:flex md:w-60 lg:w-64 shrink-0 flex-col border-r border-[#1c2621] bg-[#0a0e0c]">
      <div className="px-3 py-3 text-[11px] uppercase tracking-widest text-[#6b7a72] flex items-center gap-1">
        <ChevronDown size={12} />
        Explorer
      </div>
      <div className="px-2 pb-2 text-[13px] font-mono text-[#8b978f] uppercase tracking-wide">
        shrenik-portfolio
      </div>
      <nav className="flex-1 overflow-y-auto px-1">
        {TABS.map((tab) => {
          const Icon = iconFor(tab.lang);
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelect(tab.id)}
              className={`group flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-[13px] font-mono transition-colors ${
                isActive
                  ? "bg-[#132018] text-[#c9d1d9]"
                  : "text-[#8b978f] hover:bg-[#0f1512] hover:text-[#c9d1d9]"
              }`}
            >
              <Icon
                size={15}
                style={{ color: isActive ? langColor[tab.lang] : "#556058" }}
                className="shrink-0"
              />
              <span className="truncate">{tab.fileName}</span>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-[#1c2621] p-3 text-[11px] font-mono text-[#556058] space-y-2">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#39ff8e] glow-pulse" />
          available for interesting problems
        </div>
        <div className="flex items-center gap-3 pt-1">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#39ff8e] transition-colors"
            aria-label="GitHub"
          >
            <GithubIcon size={16} />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#39ff8e] transition-colors"
            aria-label="LinkedIn"
          >
            <LinkedinIcon size={16} />
          </a>
        </div>
      </div>
    </aside>
  );
}
