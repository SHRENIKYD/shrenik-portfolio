"use client";

// Purely decorative — mimics a VS Code minimap. Widths/colors are derived
// deterministically from the index (not Math.random) so SSR and client
// markup match exactly.
const TOKEN_COLORS = ["#39ff8e55", "#6cb6ff55", "#ff6ac155", "#ffb45455", "#556058"];
const LINE_COUNT = 70;

function widthFor(i: number) {
  const w = 20 + Math.abs(Math.sin(i * 1.31 + 0.4)) * 65;
  return `${w}%`;
}

export default function CodeMinimap() {
  return (
    <div
      aria-hidden
      className="relative hidden xl:block w-7 shrink-0 overflow-hidden border-l border-[#1c2621] bg-[#0a0e0c]/60 py-4"
    >
      <div className="flex flex-col gap-[3px] px-1.5">
        {Array.from({ length: LINE_COUNT }, (_, i) => (
          <span
            key={i}
            className="block h-[2px] rounded-sm"
            style={{
              width: widthFor(i),
              background: TOKEN_COLORS[i % TOKEN_COLORS.length],
            }}
          />
        ))}
      </div>

      {/* drifting "viewport" indicator */}
      <div className="minimap-viewport pointer-events-none absolute inset-x-0 h-16 bg-[#39ff8e]/10 border-y border-[#39ff8e]/20" />

      <style>{`
        @keyframes minimap-drift {
          0% { transform: translateY(0); }
          50% { transform: translateY(340%); }
          100% { transform: translateY(0); }
        }
        .minimap-viewport {
          top: 0;
          animation: minimap-drift 14s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
