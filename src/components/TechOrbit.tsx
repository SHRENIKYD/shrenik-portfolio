"use client";

import { useEffect, useRef, useState } from "react";
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

// "How the solar system actually moves" style orbit: the center (avatar)
// itself slowly drifts in a small loop instead of sitting still, so each
// tech's much-faster orbit around it traces a spiral/helix rather than a
// plain circle — position = sun-drift + orbit-around-sun, the same
// epicycle math behind that famous animation. That needs a persistent
// fading trail rather than a couple of discrete comet dots, so this is
// driven by requestAnimationFrame + canvas (same fading-paint technique as
// InteractiveBackground's spark trail) instead of CSS keyframes, with the
// tech badges riding the exact same per-frame math on top so they land
// precisely on the line the canvas is drawing.

type Planet = {
  label: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  radiusFrac: number; // fraction of the measured-safe max radius for its ring
  period: number; // seconds per revolution
  phaseDeg: number;
  color: string;
  badgeSize: number;
  iconSize: number;
};

const SUN_PERIOD = 38; // seconds — slow drift, barely noticeable on its own
const SUN_DRIFT_FRAC = 0.16; // fraction of the safe radius budget
const ELLIPSE_SQUISH = 0.55; // radiusY = radiusX * this, for the top-down-ish look
const MAX_SCALE = 1.18; // depth pop at the "closest to viewer" point of an orbit

// Cosmic backdrop: a starfield drifting uniformly in one direction (not
// each star wandering independently) is what reads as "the whole system is
// travelling," the way the reference animation's background does.
const STAR_COUNT = 46;
const STAR_DRIFT_ANGLE_DEG = 200; // shared direction for every star
const STAR_DRIFT_SPEED = 3.2; // px/s

type Star = {
  fx: number; // 0..1, fraction of card width
  fy: number; // 0..1, fraction of card height
  r: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  tint: string;
};

function makeStars(): Star[] {
  const tints = ["#e8f0ff", "#e8f0ff", "#e8f0ff", "#9fd8ff", "#ffd9a0"];
  return Array.from({ length: STAR_COUNT }, () => ({
    fx: Math.random(),
    fy: Math.random(),
    r: 0.5 + Math.random() * 1.1,
    baseAlpha: 0.25 + Math.random() * 0.55,
    twinkleSpeed: 0.4 + Math.random() * 1.1,
    twinklePhase: Math.random() * Math.PI * 2,
    tint: tints[Math.floor(Math.random() * tints.length)],
  }));
}

// mod() that stays positive for negative inputs — Number % can return a
// negative remainder in JS, which would place a wrapped star just off the
// wrong edge instead of wrapping cleanly.
function wrap(v: number, max: number) {
  return ((v % max) + max) % max;
}

// Two "rings" worth of techs, same catalogue as the old design. Ring 2
// (outer, blue) gets the full safe radius; ring 1 (inner, green) gets a
// smaller fraction so it nests inside without colliding, and a shorter
// period so the two rings drift in and out of phase with each other
// instead of always lining up — that's what keeps the spiral looking like
// a spiral instead of two overlapping circles.
const PLANETS: Planet[] = [
  { label: "Angular 21", Icon: AngularIcon, radiusFrac: 1, period: 23, phaseDeg: 0, color: "#6cb6ff", badgeSize: 26, iconSize: 12 },
  { label: "Azure AI", Icon: AzureIcon, radiusFrac: 1, period: 23, phaseDeg: 90, color: "#6cb6ff", badgeSize: 26, iconSize: 12 },
  { label: "Knockout.js", Icon: KnockoutIcon, radiusFrac: 1, period: 23, phaseDeg: 180, color: "#6cb6ff", badgeSize: 26, iconSize: 12 },
  { label: "Git", Icon: GitIcon, radiusFrac: 1, period: 23, phaseDeg: 270, color: "#6cb6ff", badgeSize: 26, iconSize: 12 },
  { label: "C#", Icon: CSharpIcon, radiusFrac: 0.54, period: 14, phaseDeg: 45, color: "#39ff8e", badgeSize: 22, iconSize: 10 },
  { label: ".NET Core", Icon: DotNetIcon, radiusFrac: 0.54, period: 14, phaseDeg: 135, color: "#39ff8e", badgeSize: 22, iconSize: 10 },
  { label: "SQL", Icon: SqlServerIcon, radiusFrac: 0.54, period: 14, phaseDeg: 225, color: "#39ff8e", badgeSize: 22, iconSize: 10 },
  { label: "Java", Icon: JavaIcon, radiusFrac: 0.54, period: 14, phaseDeg: 315, color: "#39ff8e", badgeSize: 22, iconSize: 10 },
];

function deg2rad(d: number) {
  return (d * Math.PI) / 180;
}

export default function TechOrbit() {
  const [photoFailed, setPhotoFailed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const starCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const planetRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const starCanvas = starCanvasRef.current;
    const canvas = canvasRef.current;
    const avatar = avatarRef.current;
    if (!container || !starCanvas || !canvas || !avatar) return;
    const starCtx = starCanvas.getContext("2d");
    const ctx = canvas.getContext("2d");
    if (!starCtx || !ctx) return;

    const stars = makeStars();

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let W = 0;
    let H = 0;
    let cx = 0;
    let cy = 0;
    let maxRadiusX = 0;
    let sunDriftX = 0;
    let sunDriftY = 0;

    // Derives every radius from the card's actual measured size instead of
    // guessed pixel constants — the biggest badge, at its biggest depth
    // scale, plus the sun's own drift, is subtracted from the usable
    // half-width up front, so no orbit position can ever place a badge
    // past the card edge, regardless of how wide the sidebar ends up.
    function measure() {
      const rect = container!.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      cx = W / 2;
      cy = H / 2;

      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      canvas!.style.width = `${W}px`;
      canvas!.style.height = `${H}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, W, H);

      starCanvas!.width = W * dpr;
      starCanvas!.height = H * dpr;
      starCanvas!.style.width = `${W}px`;
      starCanvas!.style.height = `${H}px`;
      starCtx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const biggestBadgeHalf = (26 / 2) * MAX_SCALE;
      const safety = 4;
      const usableHalfW = W / 2 - safety;
      sunDriftX = usableHalfW * SUN_DRIFT_FRAC;
      sunDriftY = sunDriftX * ELLIPSE_SQUISH;
      maxRadiusX = usableHalfW - sunDriftX - biggestBadgeHalf;
    }

    measure();
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    function onResize() {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(measure, 150);
    }
    window.addEventListener("resize", onResize);

    function drawStars(t: number) {
      starCtx!.clearRect(0, 0, W, H);
      const driftX = Math.cos(deg2rad(STAR_DRIFT_ANGLE_DEG)) * STAR_DRIFT_SPEED * t;
      const driftY = Math.sin(deg2rad(STAR_DRIFT_ANGLE_DEG)) * STAR_DRIFT_SPEED * t;
      for (const s of stars) {
        const x = wrap(s.fx * W + driftX, W);
        const y = wrap(s.fy * H + driftY, H);
        const twinkle = 0.55 + 0.45 * Math.sin(t * s.twinkleSpeed + s.twinklePhase);
        starCtx!.beginPath();
        starCtx!.fillStyle = s.tint;
        starCtx!.globalAlpha = s.baseAlpha * twinkle;
        starCtx!.arc(x, y, s.r, 0, Math.PI * 2);
        starCtx!.fill();
      }
      starCtx!.globalAlpha = 1;
    }

    function positionAt(t: number) {
      const sunAngle = (t / SUN_PERIOD) * 360;
      const sunX = cx + sunDriftX * Math.cos(deg2rad(sunAngle));
      const sunY = cy + sunDriftY * Math.sin(deg2rad(sunAngle));

      avatar!.style.transform = `translate(-50%, -50%) translate(${sunX - cx}px, ${sunY - cy}px)`;

      PLANETS.forEach((p, i) => {
        const rx = maxRadiusX * p.radiusFrac;
        const ry = rx * ELLIPSE_SQUISH;
        const angle = p.phaseDeg + (t / p.period) * 360;
        const rad = deg2rad(angle);
        const px = sunX + rx * Math.cos(rad);
        const py = sunY + ry * Math.sin(rad);

        const depth = Math.sin(rad); // -1 (farthest behind avatar) .. 1 (closest/front)
        const scale = 1 + depth * (MAX_SCALE - 1);
        const opacity = 0.4 + ((depth + 1) / 2) * 0.6;
        const z = Math.round(11 + depth * 9); // always > the canvas's own ~0 level

        const el = planetRefs.current[i];
        if (el) {
          el.style.transform = `translate(${px - cx}px, ${py - cy}px) translate(-50%, -50%) scale(${scale})`;
          el.style.opacity = String(opacity);
          el.style.zIndex = String(z);
        }

        ctx!.beginPath();
        ctx!.fillStyle = p.color;
        ctx!.globalAlpha = 0.45 + ((depth + 1) / 2) * 0.45;
        ctx!.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx!.fill();
      });

      // faint marker tracing the sun's own drift path
      ctx!.beginPath();
      ctx!.fillStyle = "#ffb454";
      ctx!.globalAlpha = 0.5;
      ctx!.arc(sunX, sunY, 1.3, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.globalAlpha = 1;
    }

    let rafId = 0;
    let start = 0;
    let visible = !document.hidden;

    function tick(ts: number) {
      if (!start) start = ts;
      const t = (ts - start) / 1000;

      // Erasing (not fading to an opaque color) is what lets the starfield
      // canvas underneath stay visible through the trail — "destination-out"
      // reduces this canvas's own alpha back toward fully transparent
      // instead of painting over whatever's behind it. The erase amount is
      // deliberately tiny: orbits take 14-23s, so the trail needs to still
      // be visible most of the way through a full loop, not just the last
      // second of motion.
      ctx!.globalCompositeOperation = "destination-out";
      ctx!.fillStyle = "rgba(0, 0, 0, 0.0035)";
      ctx!.fillRect(0, 0, W, H);
      ctx!.globalCompositeOperation = "source-over";

      drawStars(t);
      positionAt(t);

      if (visible) rafId = requestAnimationFrame(tick);
    }

    function onVisibility() {
      visible = !document.hidden;
      if (visible && !reduceMotion) rafId = requestAnimationFrame(tick);
    }
    document.addEventListener("visibilitychange", onVisibility);

    if (reduceMotion) {
      drawStars(0);
      positionAt(0);
    } else {
      rafId = requestAnimationFrame(tick);
    }

    return () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-56 w-full overflow-hidden">
      <canvas ref={starCanvasRef} className="absolute inset-0" aria-hidden />
      <canvas ref={canvasRef} className="absolute inset-0" aria-hidden />

      {PLANETS.map((p, i) => (
        <div
          key={p.label}
          ref={(el) => {
            planetRefs.current[i] = el;
          }}
          className="group absolute left-1/2 top-1/2"
          style={{ transform: "translate(-50%, -50%)" }}
        >
          <span
            className="flex items-center justify-center rounded-full border"
            style={{
              width: p.badgeSize,
              height: p.badgeSize,
              borderColor: `${p.color}66`,
              color: p.color,
              background: "#0a0e0c",
            }}
          >
            <p.Icon size={p.iconSize} className="shrink-0" />
          </span>
          <span
            className="pointer-events-none absolute left-1/2 top-full z-30 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-full border px-1.5 py-0.5 font-mono text-[9px] opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100"
            style={{ borderColor: `${p.color}55`, color: p.color, background: "#0d1310" }}
          >
            {p.label}
          </span>
        </div>
      ))}

      <div
        ref={avatarRef}
        className="absolute left-1/2 top-1/2 z-10 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-[#39ff8e] bg-[#0a0e0c] glow-pulse"
        style={{ transform: "translate(-50%, -50%)" }}
      >
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
    </div>
  );
}
