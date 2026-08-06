"use client";

import { useState } from "react";
import { profile } from "@/data/resume";
import { withBasePath } from "@/lib/basePath";
import {
  CSharpIcon,
  DotNetIcon,
  AngularIcon,
  SqlServerIcon,
  AzureIcon,
  KnockoutIcon,
  GitIcon,
  JavaIcon,
} from "@/components/TechIcons";

// Deterministic polar layout (no Math.random) — keeps SSR/CSR markup
// identical. Two elliptical rings of skills orbit slowly around a center
// badge, each label counter-rotating so its icon stays upright. Radii are
// sized so that even the widest badge never reaches past the sidebar
// card's edge, at any point in the rotation — see icon-badge + tooltip
// approach below (a fixed-width text pill can't guarantee that, a
// circular badge can, since its footprint is identical in every
// direction).
const ORBIT_SECONDS = 50;

const RING_1 = [
  { label: "C#", Icon: CSharpIcon },
  { label: ".NET Core", Icon: DotNetIcon },
  { label: "SQL", Icon: SqlServerIcon },
  { label: "Java", Icon: JavaIcon },
];
const RING_2 = [
  { label: "Angular 21", Icon: AngularIcon },
  { label: "Azure AI", Icon: AzureIcon },
  { label: "Knockout.js", Icon: KnockoutIcon },
  { label: "Git", Icon: GitIcon },
];

// Trailing "comet" dots rendered a few degrees behind each badge along the
// same elliptical path — since the whole ring rotates clockwise (angle
// increases with time), a smaller angle is where the badge already was.
const TRAIL_STEPS = [
  { deg: 8, opacity: 0.26, scale: 0.56 },
  { deg: 16, opacity: 0.12, scale: 0.38 },
];

function polarEllipse(angleDeg: number, radiusX: number, radiusY: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: radiusX * Math.cos(rad),
    y: radiusY * Math.sin(rad),
  };
}

function Ring({
  items,
  radiusX,
  radiusY,
  badgeSize,
  iconSize,
  color,
  angleOffset = 0,
}: {
  items: { label: string; Icon: React.ComponentType<{ size?: number; className?: string }> }[];
  radiusX: number;
  radiusY: number;
  badgeSize: number;
  iconSize: number;
  color: string;
  // Both rings otherwise share the same 4 starting angles and rotate in
  // lockstep, so a ring-1 badge and a ring-2 badge (plus their comet
  // trails) would always sit on the same line together — crowded-looking
  // near the edges even though nothing actually overflows. Offsetting one
  // ring's angles spreads badges out evenly around the ellipse instead.
  angleOffset?: number;
}) {
  return (
    <>
      {items.map(({ label, Icon }, i) => {
        const angle = (360 / items.length) * i + angleOffset;
        const { x, y } = polarEllipse(angle, radiusX, radiusY);
        // Negative delay = "already this far into the loop" at t=0, which
        // phase-shifts the shared z/depth keyframes by this item's own
        // starting angle (see orbit-z / orbit-depth below).
        const delay = -((angle / 360) * ORBIT_SECONDS);

        return (
          <div
            key={label}
            className="absolute left-1/2 top-1/2"
            style={{
              transform: `translate(${x}px, ${y}px)`,
              animation: `orbit-z ${ORBIT_SECONDS}s linear infinite`,
              animationDelay: `${delay}s`,
            }}
          >
            {TRAIL_STEPS.map(({ deg, opacity, scale }, ti) => {
              const t = polarEllipse(angle - deg, radiusX, radiusY);
              return (
                <span
                  key={ti}
                  aria-hidden
                  className="pointer-events-none absolute rounded-full"
                  style={{
                    left: "50%",
                    top: "50%",
                    width: badgeSize * scale,
                    height: badgeSize * scale,
                    background: color,
                    opacity,
                    filter: "blur(1px)",
                    transform: `translate(${t.x - x}px, ${t.y - y}px) translate(-50%, -50%)`,
                  }}
                />
              );
            })}

            <div
              className="orbit-counter-spin"
              style={{
                animation: `orbit-spin-ccw ${ORBIT_SECONDS}s linear infinite`,
              }}
            >
              <div
                className="group relative"
                style={{
                  animation: `orbit-depth ${ORBIT_SECONDS}s linear infinite`,
                  animationDelay: `${delay}s`,
                }}
              >
                <span
                  className="flex items-center justify-center rounded-full border"
                  style={{
                    width: badgeSize,
                    height: badgeSize,
                    borderColor: `${color}66`,
                    color,
                    background: "#0a0e0c",
                  }}
                >
                  <Icon size={iconSize} className="shrink-0" />
                </span>
                <span
                  className="pointer-events-none absolute left-1/2 top-full z-30 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-full border px-1.5 py-0.5 font-mono text-[9px] opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100"
                  style={{ borderColor: `${color}55`, color, background: "#0d1310" }}
                >
                  {label}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

function OrbitGuide({ radiusX, radiusY }: { radiusX: number; radiusY: number }) {
  return (
    <div
      className="absolute left-1/2 top-1/2 rounded-full border border-dashed border-[#1c2621]"
      style={{
        width: radiusX * 2,
        height: radiusY * 2,
        transform: "translate(-50%, -50%)",
      }}
    />
  );
}

export default function TechOrbit() {
  const [photoFailed, setPhotoFailed] = useState(false);

  return (
    <div className="relative flex h-56 items-center justify-center">
      <div className="orbit-spin relative h-44 w-44">
        <OrbitGuide radiusX={80} radiusY={44} />
        <OrbitGuide radiusX={44} radiusY={24} />
        <Ring items={RING_2} radiusX={80} radiusY={44} badgeSize={28} iconSize={13} color="#6cb6ff" />
        <Ring
          items={RING_1}
          radiusX={44}
          radiusY={24}
          badgeSize={24}
          iconSize={11}
          color="#39ff8e"
          angleOffset={45}
        />
      </div>

      {/* center badge — outside the rotating layer, stays fixed. z-10 sits
          between the orbit-z keyframe extremes (1..20), so badges swinging
          through the "front" of the ellipse pass in front of it and
          badges at the "back" pass behind it. */}
      <div className="absolute z-10 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-[#39ff8e] bg-[#0a0e0c] glow-pulse">
        {photoFailed ? (
          <span className="font-mono text-xs font-bold text-[#39ff8e]">SY</span>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={withBasePath(profile.avatar)}
            alt={profile.name}
            onError={() => setPhotoFailed(true)}
            className="h-full w-full object-cover"
          />
        )}
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
          animation: orbit-spin-cw ${ORBIT_SECONDS}s linear infinite;
        }
        .orbit-counter-spin {
          animation: orbit-spin-ccw ${ORBIT_SECONDS}s linear infinite;
        }
        /* Pseudo-3D depth: as a badge sweeps through the bottom of its
           ellipse (world angle 90deg) it's "closest" to the viewer — bigger
           and fully opaque. At the top (270deg) it's "farthest" — smaller
           and faint. Each badge's animation-delay shifts this shared curve
           to match its own starting angle. */
        @keyframes orbit-depth {
          0%   { opacity: 0.78; transform: translate(-50%, -50%) scale(0.92); }
          25%  { opacity: 1;    transform: translate(-50%, -50%) scale(1.18); }
          50%  { opacity: 0.78; transform: translate(-50%, -50%) scale(0.92); }
          75%  { opacity: 0.42; transform: translate(-50%, -50%) scale(0.7); }
          100% { opacity: 0.78; transform: translate(-50%, -50%) scale(0.92); }
        }
        /* Stacking order companion to orbit-depth — lets "close" badges
           render in front of the center avatar and "far" badges render
           behind it. Kept on a separate (non-transform) property so it
           can't clobber the anchor div's own static translate(x, y). */
        @keyframes orbit-z {
          0%   { z-index: 5; }
          25%  { z-index: 20; }
          50%  { z-index: 5; }
          75%  { z-index: 1; }
          100% { z-index: 5; }
        }
      `}</style>
    </div>
  );
}
