"use client";

// Deterministic polar layout (no Math.random) — keeps SSR/CSR markup
// identical. Two rings of skills orbit slowly around a center badge;
// each label counter-rotates so the text itself stays upright.
const RING_1 = ["C#", ".NET Core", "SQL"];
const RING_2 = ["Angular 21", "Azure AI", "Knockout.js", "Git"];

function polar(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: radius * Math.cos(rad),
    y: radius * Math.sin(rad),
  };
}

function Ring({
  items,
  radius,
  color,
}: {
  items: string[];
  radius: number;
  color: string;
}) {
  return (
    <>
      {items.map((label, i) => {
        const angle = (360 / items.length) * i;
        const { x, y } = polar(angle, radius);
        return (
          <div
            key={label}
            className="absolute left-1/2 top-1/2"
            style={{ transform: `translate(${x}px, ${y}px)` }}
          >
            <span
              className="orbit-counter-spin block -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border px-2 py-0.5 font-mono text-[10px]"
              style={{ borderColor: `${color}55`, color, background: "#0a0e0c" }}
            >
              {label}
            </span>
          </div>
        );
      })}
    </>
  );
}

export default function TechOrbit() {
  return (
    <div className="relative flex h-56 items-center justify-center">
      <div className="orbit-spin relative h-44 w-44">
        <div className="absolute inset-0 rounded-full border border-dashed border-[#1c2621]" />
        <div className="absolute inset-[26px] rounded-full border border-dashed border-[#1c2621]" />
        <Ring items={RING_2} radius={88} color="#6cb6ff" />
        <Ring items={RING_1} radius={48} color="#39ff8e" />
      </div>

      {/* center badge — outside the rotating layer, stays fixed */}
      <div className="absolute flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#39ff8e] bg-[#0a0e0c] font-mono text-xs font-bold text-[#39ff8e] glow-pulse">
        SY
      </div>

      <style>{`
        @keyframes orbit-spin-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbit-spin-ccw {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .orbit-spin {
          animation: orbit-spin-cw 50s linear infinite;
        }
        .orbit-counter-spin {
          animation: orbit-spin-ccw 50s linear infinite;
        }
      `}</style>
    </div>
  );
}
