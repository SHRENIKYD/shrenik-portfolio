"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Takes the "I am scrolling a web page" feeling out of the site.
//
// Native scrolling still drives everything — the wheel, the trackpad, the
// keyboard, anchor jumps, the scroll position itself. What changes is that
// the content no longer moves in lockstep with it: the page body is given
// the content's height, the content is pinned and translated, and that
// translation eases toward the real scroll position instead of matching it.
// The result reads as moving through a scene with weight, rather than
// dragging a document. The scrollbar is hidden to finish the illusion — the
// progress bar along the top edge is the position indicator instead.
//
// Only wraps the scrolling content. Anything fixed — the background, the
// nav, the contact overlay — must stay outside, because a transformed
// ancestor would capture it.
//
// Reduced-motion falls back to ordinary native scrolling, untouched.

// While the content is pinned, an element's viewport rect no longer moves
// with document scroll, so the browser's own scrollIntoView computes a
// scroll of zero and every anchor link silently does nothing. Anchor
// navigation therefore has to go through scrollToId below, which reads the
// live eased position to work out where the element actually sits.
let easedPosition: (() => number) | null = null;

/**
 * Scroll to an element by id, correctly, whether or not eased scrolling is
 * active. Use this instead of `scrollIntoView` anywhere inside the pinned
 * content.
 */
export function scrollToId(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  if (!easedPosition) {
    // reduced-motion: ordinary document scrolling, so the native call is right
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  // Jump the scroll position instantly and let the easing do the travelling —
  // native smooth scrolling on top of the eased transform would compound into
  // a sluggish double animation.
  window.scrollTo({ top: el.getBoundingClientRect().top + easedPosition(), behavior: "auto" });
}

const EASE = 0.085; // approach rate per 60Hz frame — lower is heavier
const SETTLE = 0.08; // px below which we snap, so text stops on a pixel
const MAX_DT = 0.1; // cap after a background tab, so it catches up rather than crawls

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    root.classList.add("smooth-scroll");
    el.style.position = "fixed";
    el.style.top = "0";
    el.style.left = "0";
    el.style.width = "100%";
    el.style.zIndex = "10"; // above the fixed WebGL background at z-0
    el.style.willChange = "transform";

    // the body carries the height the pinned content no longer contributes
    const setHeight = () => {
      document.body.style.height = `${el.scrollHeight}px`;
    };
    setHeight();
    const ro = new ResizeObserver(setHeight);
    ro.observe(el);
    window.addEventListener("resize", setHeight);

    let current = window.scrollY;
    easedPosition = () => current;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(MAX_DT, (now - last) / 1000);
      last = now;
      // The approach has to be wall-clock based, not per-frame: a fixed
      // per-frame rate settles twice as fast on a 120Hz display and crawls
      // hundreds of pixels behind the scroll on a struggling one. Expressed
      // this way the weight feels identical everywhere, and a slow device
      // degrades gracefully toward ordinary scrolling instead of breaking.
      const factor = 1 - Math.pow(1 - EASE, dt * 60);
      const target = window.scrollY;
      current += (target - current) * factor;
      if (Math.abs(target - current) < SETTLE) current = target;
      el.style.transform = `translate3d(0, ${-current}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      easedPosition = null;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", setHeight);
      root.classList.remove("smooth-scroll");
      document.body.style.height = "";
      el.removeAttribute("style");
    };
  }, []);

  return <div ref={ref}>{children}</div>;
}
