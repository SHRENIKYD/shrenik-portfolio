"use client";

import { TABS, langColor } from "@/data/tabs";

export default function TabBar({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex items-stretch overflow-x-auto border-b border-[#1c2621] bg-[#0a0e0c] text-[13px] font-mono">
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            className={`group relative flex shrink-0 items-center gap-2 border-r border-[#1c2621] px-4 py-2.5 transition-colors ${
              isActive
                ? "bg-[#0d1310] text-[#c9d1d9]"
                : "text-[#63706a] hover:bg-[#0d1310]/60 hover:text-[#8b978f]"
            }`}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: langColor[tab.lang] }}
            />
            {tab.fileName}
            {isActive && (
              <span className="absolute inset-x-0 -bottom-px h-[2px] bg-[#39ff8e]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
