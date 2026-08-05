"use client";

// Fixed (not random) node layout — keeps server/client markup identical.
// Lives inside its own bordered card in the About-tab rail, so it can run
// much brighter than a full-page background without fighting page text.
const NODES = [
  { label: "C#", x: 12, y: 15, delay: 0 },
  { label: ".NET Core", x: 30, y: 55, delay: 0.6 },
  { label: "Angular 21", x: 82, y: 20, delay: 1.2 },
  { label: "SQL", x: 65, y: 80, delay: 1.8 },
  { label: "Azure AI", x: 45, y: 35, delay: 2.4 },
  { label: "VB.NET", x: 18, y: 85, delay: 3.0 },
  { label: "Knockout.js", x: 78, y: 58, delay: 3.6 },
  { label: "Git", x: 50, y: 92, delay: 4.2 },
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
    <div aria-hidden className="relative h-48 w-full overflow-hidden">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full opacity-70"
      >
        {EDGES.map(([a, b], i) => (
          <line
            key={i}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
            stroke="#39ff8e"
            strokeWidth={0.3}
          />
        ))}
        {NODES.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={0.9} fill="#39ff8e" />
        ))}
      </svg>
      {NODES.map((n) => (
        <span
          key={n.label}
          className="absolute font-mono text-[10px] text-[#39ff8e] whitespace-nowrap"
          style={{
            left: `${n.x}%`,
            top: `${n.y}%`,
            transform: "translate(-50%, 6px)",
            animation: `drift 9s ease-in-out ${n.delay}s infinite`,
          }}
        >
          {n.label}
        </span>
      ))}
      <style>{`
        @keyframes drift {
          0%, 100% { transform: translate(-50%, 6px); }
          50% { transform: translate(calc(-50% + 4px), 0px); }
        }
      `}</style>
    </div>
  );
}
