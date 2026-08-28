"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "@/data/resume";
import { withBasePath } from "@/lib/basePath";
import { contact as sfx } from "@/lib/sound";
import { scrollToId } from "@/components/beta/SmoothScroll";

// Full-screen contact takeover — the "Neon ignition" concept picked from
// the Hailing Frequencies mockups. Opened from anywhere via the
// "open-contact" window event (pill nav, menu overlay, wayfinding). The
// overlay is a dead neon sign getting its power back: every character
// flickers, stutters, then holds with a green-white glow — ignition
// spreads in waves and a few tubes stay faulty forever. A wireframe
// globe turns behind with Bengaluru pinged.
//
// Scored with the "Terminal" profile: a relay click per flicker, a keycap
// thock as each character locks, a faint fan bed once the sign holds, and
// an old-CRT collapse on the way out. Because the overlay always opens
// from a click, its audio context is never blocked. See src/lib/sound.ts.

const ROWS = ["BEN", "GAL", "URU"];

export const openContact = () => window.dispatchEvent(new Event("open-contact"));

function Neon({ text }: { text: string }) {
  return (
    <>
      {text.split("").map((ch, i) => (
        <span key={i} data-neon className="inline-block" style={{ opacity: 0.07 }}>
          {ch}
        </span>
      ))}
    </>
  );
}

export default function BetaContactOverlay() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("open-contact", onOpen);
    return () => window.removeEventListener("open-contact", onOpen);
  }, []);

  // Escape closes; body scroll locks while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  // neon ignition engine
  useEffect(() => {
    if (!open) return;
    const root = rootRef.current;
    if (!root) return;
    const spans = Array.from(root.querySelectorAll<HTMLElement>("[data-neon]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const GLOW = "0 0 14px rgba(57,255,142,0.55), 0 0 34px rgba(57,255,142,0.2)";
    if (reduce) {
      spans.forEach((s) => {
        s.style.opacity = "1";
        s.style.textShadow = GLOW;
      });
      return;
    }
    const order = spans.map((_, i) => i).sort(() => Math.random() - 0.5);
    const ig = new Float32Array(spans.length);
    const faulty = new Array<boolean>(spans.length);
    order.forEach((si, oi) => {
      ig[si] = 0.35 + oi * 0.05;
      faulty[si] = Math.random() < 0.06;
    });

    // the breaker throws the moment the overlay opens, and the fan bed
    // fades in once the last tube has had its turn
    sfx.powerOn();
    const lastIgnition = spans.length ? ig[order[order.length - 1]] : 0;
    const humTimer = window.setTimeout(() => sfx.humStart(), (lastIgnition + 0.5) * 1000);

    // Sound is driven off the same per-character state as the visuals, so
    // it can never drift. Throttles keep a hundred simultaneous flickers
    // from turning into a wall of noise.
    const wasOn = new Array<boolean>(spans.length).fill(false);
    const locked = new Array<boolean>(spans.length).fill(false);
    let lastFlicker = -1;
    let lastLock = -1;
    let lastFaulty = -1;

    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = (now - t0) / 1000;
      spans.forEach((s, i) => {
        const lt = t - ig[i];
        let on: boolean;
        if (lt < 0) on = false;
        else if (lt < 0.4) on = Math.random() < (lt / 0.4) * 0.8;
        else on = faulty[i] ? Math.random() < 0.86 : true;

        if (lt >= 0) {
          if (lt < 0.4) {
            // stutter window — relay clicks as the tube tries to catch
            if (on && !wasOn[i] && t - lastFlicker > 0.05) {
              lastFlicker = t;
              sfx.flicker();
            }
          } else if (!locked[i]) {
            locked[i] = true; // the character holds — one keycap thock
            if (t - lastLock > 0.045) {
              lastLock = t;
              sfx.lock();
            }
          } else if (faulty[i] && on && !wasOn[i] && t - lastFaulty > 0.5) {
            lastFaulty = t; // a dud tube ticking away for the rest of the visit
            sfx.faulty();
          }
        }
        wasOn[i] = on;

        s.style.opacity = on ? "1" : "0.07";
        s.style.textShadow = on ? GLOW : "none";
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(humTimer);
      sfx.powerOff(); // every close path lands here — CRT collapse, hum dies
    };
  }, [open]);

  // wireframe globe with Bengaluru ping
  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
    let raf = 0;
    const t0 = performance.now();
    const draw = (now: number) => {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h * 0.52;
      const R = Math.min(w, h) * 0.46;
      ctx.strokeStyle = "rgba(110,150,165,0.14)";
      ctx.lineWidth = 1;
      for (let la = -60; la <= 60; la += 30) {
        const r = Math.cos((la * Math.PI) / 180) * R;
        const y = cy + Math.sin((la * Math.PI) / 180) * R * 0.98;
        ctx.beginPath();
        ctx.ellipse(cx, y, r, r * 0.24, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      for (let lo = 0; lo < 6; lo++) {
        const ang = (lo / 6) * Math.PI + t * 0.12;
        const rx = Math.abs(Math.cos(ang)) * R;
        ctx.beginPath();
        ctx.ellipse(cx, cy, Math.max(2, rx), R * 0.98, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      // Bengaluru ping
      const px = cx + Math.cos(t * 0.12 + 1.2) * R * 0.62;
      const py = cy + R * 0.12;
      const ping = (t * 0.5) % 1;
      ctx.fillStyle = "rgba(57,255,142,0.9)";
      ctx.beginPath();
      ctx.arc(px, py, 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(57,255,142,${(0.5 * (1 - ping)).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(px, py, 4 + ping * 30, 0, Math.PI * 2);
      ctx.stroke();
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
    };
  }, [open]);

  const close = () => setOpen(false);
  const goWork = () => {
    setOpen(false);
    setTimeout(() => {
      scrollToId("work");
    }, 60);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={rootRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[60] bg-[#05080a]"
          role="dialog"
          aria-modal="true"
          aria-label="Contact"
        >
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />

          {/* pill: WORK —— CLOSE-X */}
          <div
            className="absolute left-1/2 z-10 flex -translate-x-1/2 items-center gap-4 rounded-full border px-6 py-2.5 backdrop-blur-md sm:gap-6 sm:px-8 sm:py-3"
            style={{
              top: "calc(env(safe-area-inset-top) + 1.5rem)",
              borderColor: "rgba(140,190,210,0.28)",
              background: "rgba(5,10,14,0.55)",
              boxShadow: "0 0 24px rgba(90,150,180,0.18)",
            }}
          >
            <button
              type="button"
              onClick={goWork}
              className="whitespace-nowrap font-mono text-xs uppercase tracking-[0.25em] text-[#c9d1d9] transition-colors hover:text-[#39ff8e]"
            >
              Work
            </button>
            <span aria-hidden className="h-px w-8 bg-[#3a4a55] sm:w-12" />
            <button
              type="button"
              onClick={close}
              className="whitespace-nowrap font-mono text-xs uppercase tracking-[0.25em] text-[#7fa3b0] transition-colors hover:text-[#39ff8e]"
            >
              Close-X
            </button>
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            {/* BEN / GAL / URU in neon */}
            <div className="font-mono font-bold leading-[1.05] tracking-[0.14em] text-[#dce8ec]">
              {ROWS.map((row) => (
                <div key={row} style={{ fontSize: "clamp(64px, 16vw, 108px)" }}>
                  <Neon text={row} />
                </div>
              ))}
            </div>

            <a
              href={`mailto:${profile.email}`}
              onMouseEnter={() => sfx.hover()}
              className="mt-8 border-b-2 border-[#6e8792] pb-1.5 font-mono text-base tracking-[0.12em] text-[#cfdde3] transition-colors hover:border-[#39ff8e] sm:text-xl"
            >
              <Neon text={profile.email.toUpperCase()} />
            </a>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-mono text-xs tracking-[0.28em] text-[#9db4be]">
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => sfx.hover()}
                className="transition-colors hover:text-[#39ff8e]"
              >
                <Neon text="LINKEDIN" />
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => sfx.hover()}
                className="transition-colors hover:text-[#39ff8e]"
              >
                <Neon text="GITHUB" />
              </a>
              <a
                href={withBasePath(`/${profile.resumeFile}`)}
                download
                onMouseEnter={() => sfx.hover()}
                className="transition-colors hover:text-[#39ff8e]"
              >
                <Neon text="RESUME" />
              </a>
            </div>

            <div className="mt-6 font-mono text-[11px] tracking-[0.3em] text-[#556058]">
              <Neon text={profile.phone.toUpperCase()} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
