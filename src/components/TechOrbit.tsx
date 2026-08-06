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

// The authentic "helical model of the solar system" look: the sun travels
// on a long, mostly-straight path (here: a constant-speed bounce inside the
// card, like a DVD-logo screensaver — since our canvas is small and bounded,
// unlike the reference's open space, a soft reflect off the edges is what
// keeps it "travelling" indefinitely instead of drifting off or needing a
// jarring teleport-wrap) while each tech orbits tightly around it — so the
// combined path coils into a spring/slinky shape that curves wherever the
// sun's own path curves. Trails are stroked lines (not dots), built frame
// to frame by connecting each element's previous position to its current
// one, then very slowly erased — same fading-paint idea as
// InteractiveBackground's spark trail, just applied to a moving line
// instead of discrete points.

type Planet = {
  label: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  radiusFrac: number; // fraction of the measured-safe max orbit radius
  period: number; // seconds per revolution — short, for a tightly wound coil
  phaseDeg: number;
  badgeColor: string;
  badgeSize: number;
  iconSize: number;
};

// Tight, varied radii/periods (not two shared "rings") so the coil looks
// like a real, slightly irregular spring rather than a repeating pattern —
// inner techs orbit fast and close, outer ones slower and looser.
const PLANETS: Planet[] = [
  { label: "Java", Icon: JavaIcon, radiusFrac: 0.32, period: 3.2, phaseDeg: 0, badgeColor: "#ff7b72", badgeSize: 16, iconSize: 8 },
  { label: "SQL", Icon: SqlServerIcon, radiusFrac: 0.42, period: 4.1, phaseDeg: 55, badgeColor: "#f4d35e", badgeSize: 17, iconSize: 8 },
  { label: ".NET Core", Icon: DotNetIcon, radiusFrac: 0.52, period: 5, phaseDeg: 110, badgeColor: "#c792ea", badgeSize: 18, iconSize: 9 },
  { label: "C#", Icon: CSharpIcon, radiusFrac: 0.62, period: 5.9, phaseDeg: 165, badgeColor: "#7ee3ff", badgeSize: 19, iconSize: 9 },
  { label: "Git", Icon: GitIcon, radiusFrac: 0.72, period: 6.8, phaseDeg: 220, badgeColor: "#ffb454", badgeSize: 20, iconSize: 9 },
  { label: "Knockout.js", Icon: KnockoutIcon, radiusFrac: 0.82, period: 7.7, phaseDeg: 275, badgeColor: "#ff6ac1", badgeSize: 21, iconSize: 10 },
  { label: "Azure AI", Icon: AzureIcon, radiusFrac: 0.92, period: 8.6, phaseDeg: 330, badgeColor: "#6cb6ff", badgeSize: 22, iconSize: 10 },
  { label: "Angular 21", Icon: AngularIcon, radiusFrac: 1, period: 9.5, phaseDeg: 30, badgeColor: "#39ff8e", badgeSize: 23, iconSize: 11 },
];

const ELLIPSE_SQUISH = 0.6; // radiusY = radiusX * this
const MAX_SCALE = 1.2; // depth pop at the "closest to viewer" point of an orbit
const SUN_SPEED_FRAC = 1 / 16; // fraction of the roam box's width crossed per second
const TRAIL_COLOR = "139, 208, 255"; // cohesive blue-white, rgb triplet (reused with varying alpha)
const SUN_TRAIL_COLOR = "255, 214, 138"; // warm gold, brighter/thicker — the sun's own path

// Cosmic backdrop: a starfield drifting uniformly in one direction (not
// each star wandering independently) is what reads as "the whole system is
// travelling," matching the reference's background.
const STAR_COUNT = 46;
const STAR_DRIFT_ANGLE_DEG = 200;
const STAR_DRIFT_SPEED = 3.2; // px/s

type Star = {
  fx: number;
  fy: number;
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

function wrap(v: number, max: number) {
  return ((v % max) + max) % max;
}

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
    let maxRadiusX = 0;
    // Sun's roam box — how far its center can bounce around in. Derived
    // from the measured card size minus the biggest orbit (at its biggest
    // depth-scale) and a safety margin, so no badge can ever land past the
    // card edge regardless of where in its bounce cycle the sun currently
    // is. Orbit radii are kept deliberately tight (see PLANETS) precisely
    // so most of the card's width is left for the sun to actually roam —
    // that's what produces a long travelling path instead of a cramped
    // wobble in place.
    let boundXMin = 0;
    let boundXMax = 0;
    let boundYMin = 0;
    let boundYMax = 0;

    function measure() {
      const rect = container!.getBoundingClientRect();
      W = rect.width;
      const H_ = rect.height;
      H = H_;

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

      const biggestBadgeHalf = (23 / 2) * MAX_SCALE;
      const safety = 4;
      maxRadiusX = W * 0.17; // tight coil radius, fraction of card width
      const reserveX = maxRadiusX + biggestBadgeHalf + safety;
      const reserveY = maxRadiusX * ELLIPSE_SQUISH + biggestBadgeHalf + safety;

      boundXMin = reserveX;
      boundXMax = Math.max(reserveX, W - reserveX);
      boundYMin = reserveY;
      boundYMax = Math.max(reserveY, H - reserveY);
    }

    measure();
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    function onResize() {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(measure, 150);
    }
    window.addEventListener("resize", onResize);

    // Bouncing-ball physics for the sun (DVD-logo style): constant speed,
    // direction reflects off the roam box walls. That's what gives a long,
    // continuous, gently-curving travel path with no discontinuity ever —
    // a hard wrap-teleport would look like a glitch on the actual profile
    // photo, not a stylistic choice.
    const roamW = boundXMax - boundXMin || 1;
    const speed = roamW * SUN_SPEED_FRAC;
    let sunX = W / 2;
    let sunY = H / 2;
    let sunVX = speed * Math.cos(deg2rad(52));
    let sunVY = speed * Math.sin(deg2rad(52));

    const lastPlanetPos: ({ x: number; y: number } | null)[] = PLANETS.map(() => null);
    let lastSunPos: { x: number; y: number } | null = null;

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

    function strokeSegment(from: { x: number; y: number } | null, to: { x: number; y: number }, rgb: string, alpha: number, width: number) {
      if (!from) return;
      ctx!.beginPath();
      ctx!.strokeStyle = `rgba(${rgb}, ${alpha})`;
      ctx!.lineWidth = width;
      ctx!.lineCap = "round";
      ctx!.moveTo(from.x, from.y);
      ctx!.lineTo(to.x, to.y);
      ctx!.stroke();
    }

    function step(dt: number, t: number) {
      // advance + bounce
      sunX += sunVX * dt;
      sunY += sunVY * dt;
      if (sunX < boundXMin) {
        sunX = boundXMin;
        sunVX = Math.abs(sunVX);
      } else if (sunX > boundXMax) {
        sunX = boundXMax;
        sunVX = -Math.abs(sunVX);
      }
      if (sunY < boundYMin) {
        sunY = boundYMin;
        sunVY = Math.abs(sunVY);
      } else if (sunY > boundYMax) {
        sunY = boundYMax;
        sunVY = -Math.abs(sunVY);
      }

      avatar!.style.transform = `translate(-50%, -50%) translate(${sunX - W / 2}px, ${sunY - H / 2}px)`;

      strokeSegment(lastSunPos, { x: sunX, y: sunY }, SUN_TRAIL_COLOR, 0.85, 1.8);
      lastSunPos = { x: sunX, y: sunY };

      PLANETS.forEach((p, i) => {
        const rx = maxRadiusX * p.radiusFrac;
        const ry = rx * ELLIPSE_SQUISH;
        const angle = p.phaseDeg + (t / p.period) * 360;
        const rad = deg2rad(angle);
        const px = sunX + rx * Math.cos(rad);
        const py = sunY + ry * Math.sin(rad);

        const depth = Math.sin(rad); // -1 (behind avatar) .. 1 (in front)
        const scale = 1 + depth * (MAX_SCALE - 1);
        const opacity = 0.45 + ((depth + 1) / 2) * 0.55;
        const z = Math.round(11 + depth * 9);

        const el = planetRefs.current[i];
        if (el) {
          el.style.transform = `translate(${px - W / 2}px, ${py - H / 2}px) translate(-50%, -50%) scale(${scale})`;
          el.style.opacity = String(opacity);
          el.style.zIndex = String(z);
        }

        strokeSegment(lastPlanetPos[i], { x: px, y: py }, TRAIL_COLOR, 0.5 + ((depth + 1) / 2) * 0.35, 1.1);
        lastPlanetPos[i] = { x: px, y: py };
      });
    }

    let rafId = 0;
    let start = 0;
    let lastT = 0;
    let visible = !document.hidden;

    function tick(ts: number) {
      if (!start) start = ts;
      const t = (ts - start) / 1000;
      const dt = Math.min(t - lastT, 0.1); // clamp so a background-tab gap doesn't fling the sun
      lastT = t;

      // Erasing (not fading to an opaque color) is what lets the starfield
      // canvas underneath stay visible through the trail — destination-out
      // reduces this canvas's own alpha back toward transparent instead of
      // painting over whatever's behind it. The erase amount is tiny so
      // several seconds of coiling stay visible at once, not just the last
      // instant of motion.
      ctx!.globalCompositeOperation = "destination-out";
      ctx!.fillStyle = "rgba(0, 0, 0, 0.006)";
      ctx!.fillRect(0, 0, W, H);
      ctx!.globalCompositeOperation = "source-over";

      drawStars(t);
      step(dt, t);

      if (visible) rafId = requestAnimationFrame(tick);
    }

    function onVisibility() {
      visible = !document.hidden;
      if (visible && !reduceMotion) {
        lastT = 0;
        start = 0;
        rafId = requestAnimationFrame(tick);
      }
    }
    document.addEventListener("visibilitychange", onVisibility);

    if (reduceMotion) {
      drawStars(0);
      avatar.style.transform = `translate(-50%, -50%) translate(${sunX - W / 2}px, ${sunY - H / 2}px)`;
      PLANETS.forEach((p, i) => {
        const rx = maxRadiusX * p.radiusFrac;
        const ry = rx * ELLIPSE_SQUISH;
        const rad = deg2rad(p.phaseDeg);
        const px = sunX + rx * Math.cos(rad);
        const py = sunY + ry * Math.sin(rad);
        const el = planetRefs.current[i];
        if (el) el.style.transform = `translate(${px - W / 2}px, ${py - H / 2}px) translate(-50%, -50%)`;
      });
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
              borderColor: `${p.badgeColor}77`,
              color: p.badgeColor,
              background: "#0a0e0c",
            }}
          >
            <p.Icon size={p.iconSize} className="shrink-0" />
          </span>
          <span
            className="pointer-events-none absolute left-1/2 top-full z-30 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-full border px-1.5 py-0.5 font-mono text-[9px] opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100"
            style={{ borderColor: `${p.badgeColor}55`, color: p.badgeColor, background: "#0d1310" }}
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
