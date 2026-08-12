"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import CubeNav from "@/components/CubeNav";
import StatusBar from "@/components/StatusBar";
import CommandPalette from "@/components/CommandPalette";
import AboutTab from "@/components/tabs/AboutTab";
import ExperienceTab from "@/components/tabs/ExperienceTab";
import ProjectsTab from "@/components/tabs/ProjectsTab";
import ArchitectureTab from "@/components/tabs/ArchitectureTab";
import SkillsTab from "@/components/tabs/SkillsTab";
import ContactTab from "@/components/tabs/ContactTab";
import { profile } from "@/data/resume";

const TAB_COMPONENTS: Record<string, React.ComponentType> = {
  about: AboutTab,
  experience: ExperienceTab,
  projects: ProjectsTab,
  architecture: ArchitectureTab,
  skills: SkillsTab,
  contact: ContactTab,
};

export default function IdeShell() {
  const [active, setActive] = useState("about");
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const ActiveComponent = TAB_COMPONENTS[active] ?? AboutTab;

  return (
    <div className="scanlines relative z-10 flex h-screen w-full flex-col overflow-hidden">
      {/* window chrome */}
      <div className="flex items-center gap-3 border-b border-[#1c2621] bg-[#0a0e0c] px-4 py-2">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 text-center font-mono text-xs text-[#556058] truncate">
          {profile.name.toLowerCase().replace(" ", "-")}-portfolio — visual studio code
        </div>
        <div className="w-14" />
      </div>

      <div className="flex flex-1 min-h-0">
        <Sidebar active={active} onSelect={setActive} />

        <div className="flex flex-1 min-w-0 flex-col">
          <CubeNav active={active} onSelect={setActive} />

          <div className="flex-1 min-h-0 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                id={`tabpanel-${active}`}
                role="tabpanel"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="min-h-full"
              >
                <ActiveComponent />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <StatusBar onOpenPalette={() => setPaletteOpen(true)} />

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNavigate={(id) => setActive(id)}
      />
    </div>
  );
}
