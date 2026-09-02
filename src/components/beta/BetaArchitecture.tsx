"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { architectureLayers } from "@/data/resume";

// How a request actually moves through the systems behind the work — the
// narrative that was written into resume.ts long before anything rendered it.
//
// Presented as a dealt deck: one glass card per layer, the same card the work
// list uses, advancing as you scroll with the rest stacked and dimmed behind.
//
// The section pins itself rather than using position: sticky. Sticky resolves
// against a scrolling ancestor, and SmoothScroll has already replaced document
// scrolling with a pinned, translated container — so there is no scrolling
// ancestor left for sticky to attach to. Working from viewport-space rects
// sidesteps that entirely, and inherits the eased motion for free.

const VISIBLE_BEHIND = 3; // cards kept alive behind the active one

// A media query is external state, so it is read through a store subscription
// rather than a setState inside an effect: no extra render, no hydration
// mismatch (the server always sees false), and it reacts if the preference
// changes while the page is open.
const MQ = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (cb: () => void) => {
  const m = window.matchMedia(MQ);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

export default function BetaArchitecture() {
  const trackRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const reduced = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(MQ).matches,
    () => false
  );

  useEffect(() => {
    if (reduced) return;
    const track = trackRef.current;
    const pin = pinRef.current;
    if (!track || !pin) return;

    let raf = 0;
    let lastActive = -1;

    const frame = () => {
      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const span = Math.max(1, rect.height - vh);

      // manual pin: hold the panel at the top of the viewport for the length
      // of the track, then release it
      const offset = Math.min(Math.max(-rect.top, 0), span);
      pin.style.transform = `translate3d(0, ${offset}px, 0)`;

      const p = Math.min(1, Math.max(0, -rect.top / span));
      const f = p * (architectureLayers.length - 0.001);
      // round, not floor: the incoming card is visually dominant from the
      // halfway point, so flooring left the counter a card behind what the
      // reader could see
      const current = Math.min(architectureLayers.length - 1, Math.max(0, Math.round(f)));

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const d = i - f;
        const visible = d > -1 && d < VISIBLE_BEHIND;
        // Outgoing cards clear roughly twice as fast as they arrive. At an
        // even fade their text stayed legible through the next card's
        // backdrop-blur, which read as a rendering fault rather than a stack.
        card.style.opacity = visible
          ? String(d < 0 ? Math.max(0, 1 + d * 2.2) : 1 - d * 0.28)
          : "0";
        card.style.transform = `translate3d(0, ${d < 0 ? d * 40 : d * 16}px, 0) scale(${
          d < 0 ? 1 : 1 - d * 0.035
        })`;
        card.style.pointerEvents = i === current ? "auto" : "none";
      });

      if (current !== lastActive) {
        lastActive = current;
        setActive(current);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  // Reduced motion: no pinning, no deck — the same content as a plain list.
  if (reduced) {
    return (
      <section
        id="architecture"
        className="relative border-t border-[#1c2621] px-6 py-28 sm:px-10 sm:py-40"
      >
        <div className="mx-auto max-w-4xl">
          <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-[#556058]">
            02 — Architecture
          </h2>
          <div className="mt-14 space-y-6">
            {architectureLayers.map((l, i) => (
              <article key={l.id} className="rounded-2xl border border-[#1c2621] p-7">
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#6b7a72]">
                  {String(i + 1).padStart(2, "0")} — {l.sublabel}
                </div>
                <h3 className="mt-3 text-2xl font-bold tracking-tight text-[#e8efe9]">{l.label}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#a9b5ac]">{l.detail}</p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {l.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] text-[#8b978f]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="architecture" className="relative border-t border-[#1c2621]">
      {/* the track's height is the scroll budget the deck is dealt across */}
      <div ref={trackRef} className="relative h-[300vh]">
        <div ref={pinRef} className="absolute inset-x-0 top-0 h-screen will-change-transform">
          <div className="flex h-full flex-col justify-center px-6 sm:px-10">
            <div className="mx-auto w-full max-w-4xl">
              <div className="mb-12 flex items-end justify-between sm:mb-16">
                <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-[#556058]">
                  02 — Architecture
                </h2>
                <span className="font-mono text-xs text-[#556058]">
                  {String(active + 1).padStart(2, "0")} / {String(architectureLayers.length).padStart(2, "0")}
                </span>
              </div>

              <div className="relative h-[340px] sm:h-[320px]">
                {architectureLayers.map((l, i) => (
                  <article
                    key={l.id}
                    ref={(el) => {
                      cardsRef.current[i] = el;
                    }}
                    style={{ zIndex: architectureLayers.length - i }}
                    className={`absolute inset-0 rounded-2xl border p-6 backdrop-blur-md transition-colors duration-300 sm:p-9 ${
                      i === active ? "border-[#39ff8e]/35" : "border-[#1c2621]"
                    }`}
                  >
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#6b7a72]">
                      {String(i + 1).padStart(2, "0")} — {l.sublabel}
                    </div>
                    <h3 className="mt-3 text-2xl font-bold tracking-tight text-[#e8efe9] sm:text-3xl">
                      {l.label}
                    </h3>
                    <p className="mt-3 max-w-[56ch] text-[13px] leading-relaxed text-[#a9b5ac] sm:text-sm">
                      {l.detail}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {l.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] text-[#8b978f]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
