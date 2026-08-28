"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { armOnGesture, boot } from "@/lib/sound";

// Entry gate for /beta — the "Runaway terminal" concept, picked from the
// Entry Sequences mockups. A terminal types code by itself, slowly at
// first, then exponentially faster until the text is a blur; at 100%
// every character collapses into a single point and bursts back out as
// radial rays of type, and the site is revealed underneath.
//
// Canvas-driven. Shows once per session; skipped for reduced-motion;
// click / tap / any key skips immediately.
//
// Scored with the "Dead air" profile: a vast, almost inaudible room, three
// or four small dry ticks across the whole run, and a burst that is not a
// sound at all but the room cut to absolute silence with one soft tone
// arriving in the gap. See src/lib/sound.ts.

const LOAD_S = 2.6;
const IMPLODE_S = 0.34;
const BURST_S = 1.35;

const TOKENS = [
  "const", "await", "=>", "{ }", "return", "if (", "for (", "async",
  "0x1F", "!==", "push(", "map(", "sql", "net6.0", "ng build",
  "dotnet run", "// ok", "[i]", "try {", "catch", "SELECT", "JOIN",
  "public", "void", "Task<", "linq", "app.Run()", "az deploy",
];
const GLYPHS = "/01<>{};=+".split("");
const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';

export default function BetaLoader() {
  const [gone, setGone] = useState(true); // hidden until mount decides
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem("beta-loader-seen");
    if (!reduce && !seen) setGone(false);
  }, []);

  useEffect(() => {
    if (gone) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const size = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    window.addEventListener("resize", size);

    const dismiss = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      boot.settle();
      sessionStorage.setItem("beta-loader-seen", "1");
      setGone(true);
    };
    const onKey = () => dismiss();
    window.addEventListener("keydown", onKey);

    // the room comes up with the first character; a click anywhere also
    // unblocks audio, so a skip mid-run still lands with sound
    armOnGesture();
    boot.begin();

    // release-phase ray directions, fixed per run
    const rays = Array.from({ length: 30 }, (_, i) => ({
      a: (i / 30) * Math.PI * 2 + 0.1,
      sp: 0.6 + Math.random() * 0.8,
      seed: Math.random(),
    }));

    const buf: string[] = [];
    let chars = 0;
    let raf = 0;
    const t0 = performance.now();
    let last = t0;
    // audio phase latches — each sound fires exactly once per run
    let nextKey = 0;
    let firedImplode = false;
    let firedBurst = false;
    const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

    const tick = (now: number) => {
      const t = (now - t0) / 1000;
      // real frame delta (clamped) — typing speed must not depend on the
      // display's frame rate, only on wall-clock time
      const dt = Math.min(0.08, (now - last) / 1000);
      last = now;
      const cx = w / 2;
      const cy = h / 2;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#030507";
      ctx.fillRect(0, 0, w, h);

      if (t < LOAD_S) {
        // ---- typing phase, exponential acceleration ----
        const p = 1 - Math.pow(1 - t / LOAD_S, 2.2);
        const rate = 14 * Math.exp(p * 4.2);
        chars += rate * dt;

        // the room swells with progress; keystroke ticks fire on their own
        // clock, which tightens with p — at 900 chars/sec a tick per
        // character would just be noise
        boot.progress(p);
        if (t >= nextKey) {
          boot.key();
          nextKey = t + 0.145 * Math.pow(0.2, p) * (0.75 + Math.random() * 0.5);
        }

        while (buf.join(" ").length < chars) {
          buf.push(TOKENS[(Math.random() * TOKENS.length) | 0]);
          if (buf.length > 400) buf.shift();
        }
        ctx.font = `12px ${MONO}`;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        const lineW = Math.min(w - 64, 640);
        const x0 = (w - lineW) / 2;
        const y0 = Math.max(48, h * 0.16);
        const maxLines = Math.max(4, ((h - y0 - 140) / 18) | 0);
        const lines: string[] = [];
        let line = "";
        for (let i = 0; i < buf.length; i++) {
          if ((line + " " + buf[i]).length * 7.2 > lineW) {
            lines.push(line);
            line = buf[i];
          } else {
            line = line ? line + " " + buf[i] : buf[i];
          }
        }
        lines.push(line);
        const start = Math.max(0, lines.length - maxLines);
        for (let l = start; l < lines.length; l++) {
          const fade = 0.13 + ((l - start) / maxLines) * 0.38;
          ctx.fillStyle = `rgba(127,163,176,${fade.toFixed(3)})`;
          ctx.fillText(lines[l], x0, y0 + (l - start) * 18);
        }
        // block cursor
        const cyy = y0 + Math.min(lines.length - 1 - start, maxLines - 1) * 18;
        if (Math.floor(now / 300) % 2 === 0) {
          ctx.fillStyle = "#39ff8e";
          ctx.fillRect(x0 + ((lines[lines.length - 1].length * 7.2) % lineW) + 4, cyy, 7, 13);
        }
        ctx.font = `600 22px ${MONO}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#9fc4d4";
        ctx.fillText(`ln /${Math.min(99, Math.round(p * 100))}`, cx, h - 72);
        ctx.font = `10px ${MONO}`;
        ctx.fillStyle = "#556058";
        ctx.fillText("click anywhere to skip", cx, h - 44);
      } else {
        const rt = t - LOAD_S;
        if (rt < IMPLODE_S) {
          // ---- implosion: everything collapses to a point ----
          if (!firedImplode) {
            firedImplode = true;
            boot.implode();
          }
          const impl = rt / IMPLODE_S;
          const ir = (1 - impl) * 130;
          ctx.strokeStyle = `rgba(57,255,142,${(0.65 * impl).toFixed(3)})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(cx, cy, ir, 0, Math.PI * 2);
          ctx.stroke();
        } else if (rt < IMPLODE_S + BURST_S) {
          // ---- burst: radial rays of type ----
          if (!firedBurst) {
            firedBurst = true;
            boot.burst(); // cuts the room to nothing — that IS the sound
          }
          const bt = rt - IMPLODE_S;
          const burst = easeOut(Math.min(1, bt * 0.85));
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          for (let b = 0; b < rays.length; b++) {
            const ray = rays[b];
            const len = burst * Math.max(w, h) * 0.75 * ray.sp;
            for (let seg = 0; seg < 8; seg++) {
              const f = seg / 8;
              const rr = 20 + f * len;
              const al = Math.max(0, 0.7 - bt * 0.45) * (1 - f * 0.6);
              if (al < 0.03) continue;
              const colr =
                ray.seed < 0.5 ? "127,163,176" : ray.seed < 0.85 ? "57,255,142" : "108,182,255";
              ctx.font = `11px ${MONO}`;
              ctx.fillStyle = `rgba(${colr},${al.toFixed(3)})`;
              ctx.fillText(
                GLYPHS[(b + seg) % GLYPHS.length],
                cx + Math.cos(ray.a) * rr,
                cy + Math.sin(ray.a) * rr
              );
            }
          }
          ctx.font = `500 20px ${MONO}`;
          ctx.fillStyle = `rgba(232,239,233,${Math.max(0, 1 - bt * 0.9).toFixed(3)})`;
          ctx.fillText(">>>", cx, cy);
        } else {
          dismiss();
          return;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
      window.removeEventListener("keydown", onKey);
      boot.settle(); // never leave the room bed running
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gone]);

  const skip = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    sessionStorage.setItem("beta-loader-seen", "1");
    setGone(true);
  };

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
          onClick={skip}
          className="fixed inset-0 z-[60] cursor-pointer bg-[#030507]"
        >
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
