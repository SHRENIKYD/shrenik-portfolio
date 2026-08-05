"use client";

import { useEffect, useState } from "react";

// Fixed (not random) node layout — keeps server/client markup identical.
// Lives inside its own bordered card in the About-tab rail, so it can run
// much brighter than a full-page background without fighting page text.
// x/y kept within 10-78% vertically and 10-85% horizontally (with margin
// for the hover scale-up and label width) so nothing clips the card edges.
const NODES = [
  { label: "C#", x: 10, y: 14, delay: 0 },
  { label: ".NET Core", x: 30, y: 48, delay: 0.6 },
  { label: "Angular 21", x: 74, y: 12, delay: 1.2 },
  { label: "SQL", x: 68, y: 66, delay: 1.8 },
  { label: "Azure AI", x: 50, y: 32, delay: 2.4 },
  { label: "VB.NET", x: 14, y: 72, delay: 3.0 },
  { label: "Knockout.js", x: 70, y: 46, delay: 3.6 },
  { label: "Git", x: 46, y: 78, delay: 4.2 },
];

const EDGES: [number, number][] = [
  [0, 1],
  [0, 4],
  [1, 5],
  [2, 4],
  [2, 6],
  [3, 6],
  [4, 7],
  [3, 7],
];

// One color per node — exactly as many colors as nodes, so a shuffle
// (rather than independent random picks) guarantees every stack always
// has a color no other stack is currently wearing.
const PALETTE = [
  "#39ff8e",
  "#6cb6ff",
  "#ff6ac1",
  "#ffb454",
  "#7ee3ff",
  "#c792ea",
  "#f4d35e",
  "#ff7b72",
];

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Reshuffled every 2s. Runs only client-side (inside useEffect, after
// mount) so it never affects the server-rendered markup — no hydration
// mismatch risk from using Math.random() here.
function useNodeColors(count: number) {
  const [colors, setColors] = useState<string[]>(() => PALETTE.slice(0, count));

  useEffect(() => {
    const roll = () => setColors(shuffled(PALETTE).slice(0, count));
    roll();
    const id = setInterval(roll, 2000);
    return () => clearInterval(id);
  }, [count]);

  return colors;
}

export default function SkillConstellation() {
  const colors = useNodeColors(NODES.length);
  const [hovered, setHovered] = useState<number | null>(null);

  const isConnected = (i: number) =>
    hovered !== null && EDGES.some(([a, b]) => (a === hovered && b === i) || (b === hovered && a === i));

  return (
    <div className="relative h-56 w-full overflow-hidden">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full opacity-70"
      >
        {EDGES.map(([a, b], i) => {
          const active = hovered === a || hovered === b;
          return (
            <line
              key={i}
              x1={NODES[a].x}
              y1={NODES[a].y}
              x2={NODES[b].x}
              y2={NODES[b].y}
              stroke={active ? colors[hovered as number] : "#39ff8e"}
              strokeWidth={active ? 0.7 : 0.3}
              style={{ transition: "stroke 300ms, stroke-width 300ms" }}
            />
          );
        })}
        {NODES.map((n, i) => {
          const isHovered = hovered === i;
          const connected = isConnected(i);
          return (
            <circle
              key={i}
              cx={n.x}
              cy={n.y}
              r={isHovered ? 1.8 : connected ? 1.3 : 0.9}
              fill={colors[i]}
              style={{ transition: "r 300ms, fill 600ms" }}
            />
          );
        })}
      </svg>
      {NODES.map((n, i) => {
        const isHovered = hovered === i;
        const connected = isConnected(i);
        return (
          <span
            key={n.label}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="absolute cursor-default whitespace-nowrap rounded-full border px-1.5 py-0.5 font-mono text-[10px]"
            style={{
              left: `${n.x}%`,
              top: `${n.y}%`,
              color: colors[i],
              borderColor: isHovered ? colors[i] : "transparent",
              background: isHovered ? "#0a0e0c" : "transparent",
              transform: isHovered
                ? "translate(-50%, 6px) scale(1.25)"
                : "translate(-50%, 6px) scale(1)",
              opacity: hovered === null || isHovered || connected ? 1 : 0.35,
              zIndex: isHovered ? 10 : 1,
              boxShadow: isHovered ? `0 0 12px ${colors[i]}99` : "none",
              transition:
                "color 600ms, border-color 200ms, transform 200ms, opacity 200ms, box-shadow 200ms",
              animation: isHovered ? "none" : `drift 9s ease-in-out ${n.delay}s infinite`,
            }}
          >
            {n.label}
          </span>
        );
      })}
      <style>{`
        @keyframes drift {
          0%, 100% { transform: translate(-50%, 6px) scale(1); }
          50% { transform: translate(calc(-50% + 4px), 0px) scale(1); }
        }
      `}</style>
    </div>
  );
}
