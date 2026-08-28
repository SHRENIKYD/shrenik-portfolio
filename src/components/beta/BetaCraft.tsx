"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { skills } from "@/data/resume";

// The craft section as a flight through the stack — the "Tunnel" concept
// picked from the Craft Tiles mockups. Every skill is a tile approaching
// from deep space at one constant z-speed, growing as it passes the
// camera. Tiles use exactly two shades (a resting tone far away, a lifted
// tone up close); no per-tech colors. Canvas-driven, wall-clock timed,
// paused when offscreen or tab-hidden, static single frame under
// prefers-reduced-motion.

const ALL: { name: string; cat: string }[] = Object.entries(skills).flatMap(
  ([file, items]) => items.map((name) => ({ name, cat: file.replace(/\.(ts|json)$/, "") }))
);

const TILE_LO = "#0c1216";
const TILE_HI = "#131e24";
const EDGE = "#16222a";
const INK = "#e8efe9";
const DIM = "#556058";
const SPEED = 0.11; // z-units per second — one constant speed for everything

interface Part {
  name: string;
  ang: number;
  rad: number;
  z: number;
}

export default function BetaCraft() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    // canvas font strings can't contain var() — resolve the mono family
    // (next/font's hashed name) from the CSS custom property up front
    const monoFam =
      getComputedStyle(document.documentElement).getPropertyValue("--font-mono").trim() ||
      "ui-monospace";
    let w = 0;
    let h = 0;
    const size = () => {
      w = wrap.clientWidth;
      h = wrap.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    window.addEventListener("resize", size);

    const parts: Part[] = ALL.map((it, i) => ({
      name: it.name,
      ang: (i / ALL.length) * Math.PI * 2 + (i % 3) * 0.4,
      rad: 0.25 + ((i % 5) / 5) * 0.75,
      z: 0.08 + (i / ALL.length) * 0.92,
    }));

    let raf = 0;
    let running = false;
    let last = performance.now();

    const drawFrame = (dt: number) => {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      // faint tunnel rings for depth reference
      for (let r = 1; r <= 5; r++) {
        ctx.strokeStyle = `rgba(22,34,42,${0.9 - r * 0.15})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, r * Math.min(w, h) * 0.14, 0, Math.PI * 2);
        ctx.stroke();
      }
      parts.sort((a, b) => b.z - a.z);
      for (const p of parts) {
        p.z -= SPEED * dt;
        if (p.z <= 0.05) p.z += 0.95;
        const scale = 0.22 / p.z;
        const px = cx + Math.cos(p.ang) * p.rad * scale * Math.min(w * 0.28, 260);
        const py = cy + Math.sin(p.ang) * p.rad * scale * Math.min(h * 0.42, 170);
        const fs = Math.min(22, 11 * scale);
        if (fs < 4) continue;
        ctx.font = `500 ${fs}px ${monoFam}, ui-monospace, Menlo, monospace`;
        const tw = ctx.measureText(p.name).width + fs * 1.4;
        const th = fs * 2.1;
        const near = p.z < 0.42;
        const edgeFade = p.z < 0.12 ? (p.z - 0.05) / 0.07 : 1;
        ctx.globalAlpha = Math.min(1, Math.max(0, (1 - p.z) * 1.4)) * edgeFade;
        ctx.fillStyle = near ? TILE_HI : TILE_LO;
        ctx.strokeStyle = EDGE;
        ctx.lineWidth = 1;
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(px - tw / 2, py - th / 2, tw, th, 6);
        } else {
          ctx.rect(px - tw / 2, py - th / 2, tw, th);
        }
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = near ? INK : DIM;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.name, px, py + 1);
        ctx.globalAlpha = 1;
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.08, (now - last) / 1000);
      last = now;
      drawFrame(dt);
      if (running) raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || reduce) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    if (reduce) {
      drawFrame(0); // static arrangement, no motion
    } else {
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => (e.isIntersecting ? start() : stop())),
        { threshold: 0.1 }
      );
      io.observe(wrap);
      const onVis = () => (document.hidden ? stop() : start());
      document.addEventListener("visibilitychange", onVis);
      return () => {
        stop();
        io.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        window.removeEventListener("resize", size);
      };
    }
    return () => {
      stop();
      window.removeEventListener("resize", size);
    };
  }, []);

  return (
    <section id="craft" className="relative border-t border-[#1c2621] py-28 sm:py-40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.6 }}
        className="mb-10 flex items-end justify-between px-6 sm:mb-14 sm:px-10"
      >
        <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-[#556058]">
          02 — Craft
        </h2>
        <span className="font-mono text-xs text-[#556058]">
          {ALL.length} tools · flying past
        </span>
      </motion.div>

      <div ref={wrapRef} className="relative mx-auto h-[420px] max-w-5xl sm:h-[520px]">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      </div>
    </section>
  );
}
