export interface TabDef {
  id: string;
  fileName: string;
  folder: string;
  lang: "tsx" | "ts" | "json" | "sh" | "diagram";
}

export const TABS: TabDef[] = [
  { id: "about", fileName: "about.tsx", folder: "src", lang: "tsx" },
  { id: "experience", fileName: "experience.timeline.ts", folder: "src", lang: "ts" },
  { id: "architecture", fileName: "architecture.diagram", folder: "src", lang: "diagram" },
  { id: "skills", fileName: "skills.config.json", folder: "src", lang: "json" },
  { id: "contact", fileName: "contact.sh", folder: "scripts", lang: "sh" },
];

export const langColor: Record<TabDef["lang"], string> = {
  tsx: "#6cb6ff",
  ts: "#6cb6ff",
  json: "#ffb454",
  sh: "#39ff8e",
  diagram: "#ff6ac1",
};
