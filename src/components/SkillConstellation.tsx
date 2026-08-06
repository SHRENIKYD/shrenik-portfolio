"use client";

import { useState } from "react";

// Fixed (not random) node layout — keeps server/client markup identical.
// Lives inside its own bordered card in the About-tab rail, so it can run
// much brighter than a full-page background without fighting page text.
// x/y kept within 10-78% vertically and 10-85% horizontally (with margin
// for the hover scale-up and label width) so nothing clips the card edges.
type Category = "frontend" | "backend" | "data" | "cloud";

// Positioned top-to-bottom in the same order as the request actually
// flows through the stack on the Architecture tab (front end -> backend
// -> AI/cloud -> data -> devops), instead of an arbitrary scatter — so
// the graph reads as a pipeline, not just a decorative cluster.
const NODES: { label: string; x: number; y: number; delay: number; category: Category }[] = [
  { label: "Angular 21", x: 70, y: 10, delay: 0, category: "frontend" },
  { label: "Knockout.js", x: 28, y: 12, delay: 0.6, category: "frontend" },
  { label: "C#", x: 14, y: 34, delay: 1.2, category: "backend" },
  { label: ".NET Core", x: 45, y: 36, delay: 1.8, category: "backend" },
  { label: "VB.NET", x: 78, y: 34, delay: 2.4, category: "backend" },
  { label: "Azure AI", x: 50, y: 54, delay: 3.0, category: "cloud" },
  { label: "SQL", x: 58, y: 70, delay: 3.6, category: "data" },
  { label: "Git", x: 42, y: 84, delay: 4.2, category: "cloud" },
];

// Mostly adjacent-stage links (frontend -> backend -> cloud -> data ->
// devops), so the pulse packets below visibly travel top-to-bottom
// through the pipeline rather than bouncing between unrelated nodes.
const EDGES: [number, number][] = [
  [1, 2], // Knockout.js -> C#
  [0, 4], // Angular 21 -> VB.NET
  [2, 3], // C# -> .NET Core
  [3, 4], // .NET Core -> VB.NET
  [3, 5], // .NET Core -> Azure AI
  [5, 6], // Azure AI -> SQL
  [6, 7], // SQL -> Git
  [5, 7], // Azure AI -> Git
];

// Stable per-category color — deliberately not random, so a cluster's
// identity (and the halo drawn behind it) stays put instead of flickering.
const CATEGORY_COLORS: Record<Category, string> = {
  frontend: "#6cb6ff",
  backend: "#39ff8e",
  data: "#ffb454",
  cloud: "#c792ea",
};

const CATEGORY_LABELS: Record<Category, string> = {
  frontend: "Frontend",
  backend: "Backend",
  data: "Data",
  cloud: "Cloud / DevOps",
};

// Shown in the detail chip when a node is clicked (pinned).
const NODE_DETAILS: Record<string, string> = {
  "C#": "4+ yrs — core language across both roles",
  ".NET Core": "Primary backend framework on PCMI and IRIS",
  "Angular 21": "Newest front end — PCMI Corporation project",
  SQL: "Queries, views, and stored procs on every project",
  "Azure AI": "Newest layer — AI-driven features on PCMI",
  "VB.NET": "Legacy and new modules on the IRIS payroll platform",
  "Knockout.js": "Core front-end framework for IRIS",
  Git: "Version control across both companies",
};

// Soft colored halo per category — centroid + max member distance (+
// margin) of that category's nodes, computed once from the static layout
// above so it never drifts out of sync if positions change.
function computeHalos() {
  const groups = new Map<Category, { x: number; y: number }[]>();
  for (const n of NODES) {
    const list = groups.get(n.category) ?? [];
    list.push({ x: n.x, y: n.y });
    groups.set(n.category, list);
  }
  return [...groups.entries()].map(([category, pts]) => {
    const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
    const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
    const spread = Math.max(...pts.map((p) => Math.hypot(p.x - cx, p.y - cy)));
    return { category, cx, cy, r: spread + (pts.length > 1 ? 11 : 15) };
  });
}
const HALOS = computeHalos();

export default function SkillConstellation() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const activeIdx = pinned ?? hovered;

  const isConnected = (i: number) =>
    activeIdx !== null &&
    EDGES.some(([a, b]) => (a === activeIdx && b === i) || (b === activeIdx && a === i));

  const togglePin = (i: number) => setPinned((p) => (p === i ? null : i));

  const pinnedNode = pinned !== null ? NODES[pinned] : null;
  const chipAlign = pinnedNode ? (pinnedNode.x > 65 ? "right" : pinnedNode.x < 35 ? "left" : "center") : "center";
  const chipBelow = pinnedNode ? pinnedNode.y <= 55 : true;

  return (
    <div
      className="relative h-56 w-full overflow-hidden"
      onClick={() => setPinned(null)}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full opacity-70"
      >
        <defs>
          <filter id="constellation-halo-blur" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {HALOS.map((h) => (
          <circle
            key={h.category}
            cx={h.cx}
            cy={h.cy}
            r={h.r}
            fill={CATEGORY_COLORS[h.category]}
            opacity={0.13}
            filter="url(#constellation-halo-blur)"
          />
        ))}

        {EDGES.map(([a, b], i) => {
          const isActive = activeIdx === a || activeIdx === b;
          return (
            <line
              key={i}
              x1={NODES[a].x}
              y1={NODES[a].y}
              x2={NODES[b].x}
              y2={NODES[b].y}
              stroke={isActive ? CATEGORY_COLORS[NODES[activeIdx as number].category] : "#39ff8e"}
              strokeWidth={isActive ? 0.7 : 0.3}
              style={{ transition: "stroke 300ms, stroke-width 300ms" }}
            />
          );
        })}

        {EDGES.map(([a, b], i) => {
          const isActive = activeIdx === a || activeIdx === b;
          return (
            <circle
              key={`pulse-${i}`}
              r={isActive ? 1.1 : 0.7}
              fill={CATEGORY_COLORS[NODES[a].category]}
              opacity={isActive ? 0.95 : 0.55}
            >
              <animateMotion
                dur={`${3 + (i % 3) * 0.4}s`}
                begin={`${i * 0.5}s`}
                repeatCount="indefinite"
                path={`M${NODES[a].x},${NODES[a].y} L${NODES[b].x},${NODES[b].y}`}
              />
            </circle>
          );
        })}

        {NODES.map((n, i) => {
          const isHovered = hovered === i;
          const connected = isConnected(i);
          const color = CATEGORY_COLORS[n.category];
          return (
            <circle
              key={i}
              cx={n.x}
              cy={n.y}
              r={isHovered ? 1.8 : connected ? 1.3 : 0.9}
              fill={color}
              style={{ transition: "r 300ms" }}
            />
          );
        })}
      </svg>

      {NODES.map((n, i) => {
        const isHovered = hovered === i;
        const isPinned = pinned === i;
        const connected = isConnected(i);
        const isActive = isHovered || isPinned;
        const color = CATEGORY_COLORS[n.category];
        return (
          <span
            key={n.label}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onClick={(e) => {
              e.stopPropagation();
              togglePin(i);
            }}
            className="absolute cursor-pointer whitespace-nowrap rounded-full border px-1.5 py-0.5 font-mono text-[10px]"
            style={{
              left: `${n.x}%`,
              top: `${n.y}%`,
              color,
              borderColor: isActive ? color : isPinned ? `${color}88` : "transparent",
              background: isActive ? "#0a0e0c" : "transparent",
              transform: isActive
                ? "translate(-50%, 6px) scale(1.25)"
                : "translate(-50%, 6px) scale(1)",
              opacity: activeIdx === null || isActive || connected ? 1 : 0.35,
              zIndex: isActive ? 10 : 1,
              boxShadow: isActive ? `0 0 12px ${color}99` : "none",
              transition:
                "border-color 200ms, transform 200ms, opacity 200ms, box-shadow 200ms",
              animation: isActive ? "none" : `drift 9s ease-in-out ${n.delay}s infinite`,
            }}
          >
            {n.label}
          </span>
        );
      })}

      {pinnedNode && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute z-20 w-32 rounded-md border px-2 py-1.5 font-mono text-[9px] leading-snug shadow-lg"
          style={{
            left: `${pinnedNode.x}%`,
            top: `${pinnedNode.y}%`,
            borderColor: `${CATEGORY_COLORS[pinnedNode.category]}55`,
            background: "#0d1310",
            transform: `translate(${
              chipAlign === "right" ? "-100%" : chipAlign === "left" ? "0%" : "-50%"
            }, ${chipBelow ? "16px" : "calc(-100% - 10px)"})`,
          }}
        >
          <div className="font-semibold" style={{ color: CATEGORY_COLORS[pinnedNode.category] }}>
            {pinnedNode.label}
          </div>
          <div className="mt-0.5 text-[8px] uppercase tracking-wide text-[#556058]">
            {CATEGORY_LABELS[pinnedNode.category]}
          </div>
          <div className="mt-1 text-[#8b978f]">{NODE_DETAILS[pinnedNode.label]}</div>
        </div>
      )}

      <style>{`
        @keyframes drift {
          0%, 100% { transform: translate(-50%, 6px) scale(1); }
          50% { transform: translate(calc(-50% + 4px), 0px) scale(1); }
        }
      `}</style>
    </div>
  );
}
