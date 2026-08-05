"use client";

import { useEffect, useRef } from "react";

// Global, cursor-reactive background. Mounted once (see layout.tsx),
// fixed behind everything. Combines:
//  - a grid lattice acting as a particle network (nodes + connecting lines)
//  - a ripple/warp: nodes near the pointer push outward
//  - a spotlight reveal: nodes/lines near the pointer brighten, everything
//    else stays near-invisible
//  - a spark trail: small particles emitted as the pointer moves, fading out
//
// Kept deliberately faint so it never fights page content for attention.
// Responds to touch as well as mouse — on mobile there's no hover, so a
// finger drag drives the same ripple/spotlight/spark logic.

const RADIUS = 180; // px, spotlight/ripple influence radius
const MAX_SPARKS = 120;
const RESIZE_DEBOUNCE_MS = 200;

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
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    // Wider spacing (fewer nodes) on touch devices — keeps it smooth on
    // weaker mobile GPUs and during scroll.
    const spacing = isCoarsePointer ? 72 : 56;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function applySize(w: number, h: number) {
      width = w;
      height = h;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    applySize(window.innerWidth, window.innerHeight);

    // Debounced resize — mobile browsers fire a burst of resize events
    // while the address bar collapses/expands during scroll. Reacting to
    // every single one thrashes (and visibly flickers) the canvas. Also
    // skip entirely if only height changed by a small amount (just the
    // address bar), since width is what actually matters for the grid.
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    function onResize() {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const widthChanged = Math.abs(w - width) > 1;
        const heightChanged = Math.abs(h - height) > 120; // ignore small chrome-bar deltas
        if (widthChanged || heightChanged) applySize(w, h);
      }, RESIZE_DEBOUNCE_MS);
    }
    window.addEventListener("resize", onResize);

    const pointer = { x: -9999, y: -9999, active: false };
    let lastSparkPos = { x: -9999, y: -9999 };
    const sparks: Spark[] = [];

    function maybeSpawnSpark() {
      if (reduceMotion) return;
      const dx = pointer.x - lastSparkPos.x;
      const dy = pointer.y - lastSparkPos.y;
      if (dx * dx + dy * dy > 400 && sparks.length < MAX_SPARKS) {
        lastSparkPos = { x: pointer.x, y: pointer.y };
        sparks.push({
          x: pointer.x,
          y: pointer.y,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6 - 0.15,
          life: 1,
        });
      }
    }

    function onMouseMove(e: MouseEvent) {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
      maybeSpawnSpark();
    }
    function onMouseLeave() {
      pointer.active = false;
    }
    function onTouchMove(e: TouchEvent) {
      const t = e.touches[0];
      if (!t) return;
      pointer.x = t.clientX;
      pointer.y = t.clientY;
      pointer.active = true;
      maybeSpawnSpark();
    }
    function onTouchEnd() {
      pointer.active = false;
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    // passive: true — never blocks native scrolling
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });

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
      return t * t; // ease-in, sharper near the pointer
    }

    function drawStatic() {
      // one-time faint grid for reduced-motion users — no animation loop
      ctx!.clearRect(0, 0, width, height);
      ctx!.strokeStyle = "rgba(255, 209, 102, 0.05)";
      ctx!.lineWidth = 1;
      for (let x = 0; x <= width; x += spacing) {
        ctx!.beginPath();
        ctx!.moveTo(x, 0);
        ctx!.lineTo(x, height);
        ctx!.stroke();
      }
      for (let y = 0; y <= height; y += spacing) {
        ctx!.beginPath();
        ctx!.moveTo(0, y);
        ctx!.lineTo(width, y);
        ctx!.stroke();
      }
    }

    function tick() {
      ctx!.clearRect(0, 0, width, height);

      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;

      // precompute displaced node positions + brightness
      const nodeX = new Float32Array(cols * rows);
      const nodeY = new Float32Array(cols * rows);
      const bright = new Float32Array(cols * rows);

      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const idx = j * cols + i;
          const gx = i * spacing;
          const gy = j * spacing;
          let dx = 0;
          let dy = 0;
          let b = 0;
          if (pointer.active) {
            const ddx = gx - pointer.x;
            const ddy = gy - pointer.y;
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

      // connecting lines (network) — brighter near the pointer
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const idx = j * cols + i;
          const b = bright[idx];
          const alpha = 0.04 + b * 0.5;
          ctx!.strokeStyle = `rgba(255, 209, 102, ${alpha})`;
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
        ctx!.fillStyle = `rgba(255, 224, 153, ${0.15 + b * 0.85})`;
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
        ctx!.fillStyle = `rgba(255, 209, 102, ${s.life * 0.8})`;
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
      if (resizeTimer) clearTimeout(resizeTimer);
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
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
