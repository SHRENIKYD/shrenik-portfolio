"use client";

import { useEffect, useRef } from "react";

// Global, cursor-reactive background. Mounted once (see layout.tsx),
// fixed behind everything. Combines:
//  - a grid lattice acting as a particle network (nodes + connecting lines)
//  - a ripple/warp: nodes near the cursor push outward
//  - a spotlight reveal: nodes/lines near the cursor brighten, everything
//    else stays near-invisible
//  - a spark trail: small particles emitted as the cursor moves, fading out
//
// Kept deliberately faint so it never fights page content for attention.

const SPACING = 56;
const RADIUS = 180; // px, spotlight/ripple influence radius
const MAX_SPARKS = 120;

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 1 -> 0
}

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    const mouse = { x: -9999, y: -9999, active: false };
    let lastSparkPos = { x: -9999, y: -9999 };
    const sparks: Spark[] = [];

    function onMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;

      if (reduceMotion) return;
      const dx = mouse.x - lastSparkPos.x;
      const dy = mouse.y - lastSparkPos.y;
      if (dx * dx + dy * dy > 400 && sparks.length < MAX_SPARKS) {
        lastSparkPos = { x: mouse.x, y: mouse.y };
        sparks.push({
          x: mouse.x,
          y: mouse.y,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6 - 0.15,
          life: 1,
        });
      }
    }
    function onLeave() {
      mouse.active = false;
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    let rafId: number;
    let visible = !document.hidden;
    function onVisibility() {
      visible = !document.hidden;
      if (visible) rafId = requestAnimationFrame(tick);
    }
    document.addEventListener("visibilitychange", onVisibility);

    function falloff(dist: number) {
      if (dist >= RADIUS) return 0;
      const t = 1 - dist / RADIUS;
      return t * t; // ease-in, sharper near cursor
    }

    function drawStatic() {
      // one-time faint grid for reduced-motion users — no animation loop
      ctx!.clearRect(0, 0, width, height);
      ctx!.strokeStyle = "rgba(57, 255, 142, 0.05)";
      ctx!.lineWidth = 1;
      for (let x = 0; x <= width; x += SPACING) {
        ctx!.beginPath();
        ctx!.moveTo(x, 0);
        ctx!.lineTo(x, height);
        ctx!.stroke();
      }
      for (let y = 0; y <= height; y += SPACING) {
        ctx!.beginPath();
        ctx!.moveTo(0, y);
        ctx!.lineTo(width, y);
        ctx!.stroke();
      }
    }

    function tick() {
      ctx!.clearRect(0, 0, width, height);

      const cols = Math.ceil(width / SPACING) + 1;
      const rows = Math.ceil(height / SPACING) + 1;

      // precompute displaced node positions + brightness
      const nodeX = new Float32Array(cols * rows);
      const nodeY = new Float32Array(cols * rows);
      const bright = new Float32Array(cols * rows);

      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const idx = j * cols + i;
          const gx = i * SPACING;
          const gy = j * SPACING;
          let dx = 0;
          let dy = 0;
          let b = 0;
          if (mouse.active) {
            const ddx = gx - mouse.x;
            const ddy = gy - mouse.y;
            const dist = Math.sqrt(ddx * ddx + ddy * ddy);
            const f = falloff(dist);
            if (f > 0 && dist > 0.01) {
              const push = f * 14; // ripple strength, px
              dx = (ddx / dist) * push;
              dy = (ddy / dist) * push;
              b = f;
            }
          }
          nodeX[idx] = gx + dx;
          nodeY[idx] = gy + dy;
          bright[idx] = b;
        }
      }

      // connecting lines (network) — brighter near cursor
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const idx = j * cols + i;
          const b = bright[idx];
          const alpha = 0.04 + b * 0.5;
          ctx!.strokeStyle = `rgba(57, 255, 142, ${alpha})`;
          ctx!.lineWidth = 1;
          if (i < cols - 1) {
            const rIdx = idx + 1;
            ctx!.beginPath();
            ctx!.moveTo(nodeX[idx], nodeY[idx]);
            ctx!.lineTo(nodeX[rIdx], nodeY[rIdx]);
            ctx!.stroke();
          }
          if (j < rows - 1) {
            const dIdx = idx + cols;
            ctx!.beginPath();
            ctx!.moveTo(nodeX[idx], nodeY[idx]);
            ctx!.lineTo(nodeX[dIdx], nodeY[dIdx]);
            ctx!.stroke();
          }
        }
      }

      // nodes
      for (let idx = 0; idx < cols * rows; idx++) {
        const b = bright[idx];
        if (b < 0.02) continue; // skip near-invisible dots, cheap win
        ctx!.fillStyle = `rgba(126, 227, 255, ${0.15 + b * 0.85})`;
        const r = 1 + b * 2;
        ctx!.beginPath();
        ctx!.arc(nodeX[idx], nodeY[idx], r, 0, Math.PI * 2);
        ctx!.fill();
      }

      // sparks
      for (let k = sparks.length - 1; k >= 0; k--) {
        const s = sparks[k];
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 0.012;
        if (s.life <= 0) {
          sparks.splice(k, 1);
          continue;
        }
        ctx!.fillStyle = `rgba(57, 255, 142, ${s.life * 0.8})`;
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, 1.6 * s.life + 0.4, 0, Math.PI * 2);
        ctx!.fill();
      }

      if (visible) rafId = requestAnimationFrame(tick);
    }

    if (reduceMotion) {
      drawStatic();
    } else {
      rafId = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
