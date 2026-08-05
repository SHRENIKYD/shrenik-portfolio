"use client";

// Fixed (not random) node layout — keeps server/client markup identical
// and avoids hydration mismatches. Purely decorative background.
const NODES = [
  { label: "C#", x: 8, y: 12, delay: 0 },
  { label: ".NET", x: 22, y: 62, delay: 0.6 },
  { label: "Angular", x: 88, y: 18, delay: 1.2 },
  { label: "SQL", x: 68, y: 78, delay: 1.8 },
  { label: "Azure", x: 40, y: 30, delay: 2.4 },
  { label: "VB.NET", x: 14, y: 85, delay: 3.0 },
  { label: "Knockout.js", x: 78, y: 55, delay: 3.6 },
  { label: "Git", x: 52, y: 90, delay: 4.2 },
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

export default function SkillConstellation() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.16]"
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        {EDGES.map(([a, b], i) => (
          <line
            key={i}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
            stroke="#39ff8e"
            strokeWidth={0.15}
          />
        ))}
      </svg>
      {NODES.map((n) => (
        <span
          key={n.label}
          className="absolute font-mono text-[10px] text-[#39ff8e]"
          style={{
            left: `${n.x}%`,
            top: `${n.y}%`,
            animation: `drift 9s ease-in-out ${n.delay}s infinite`,
          }}
        >
          {n.label}
        </span>
      ))}
      <style>{`
        @keyframes drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(4px, -6px); }
        }
      `}</style>
    </div>
  );
}
