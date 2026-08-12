"use client";

import { useEffect, useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TABS, langColor } from "@/data/tabs";

// Primary navigation, reimagined as a literal cube — each of its 6 faces is
// one tab, matching TABS 1:1. Rotate to a section instead of clicking a
// flat strip. Every face is a real <button>, so keyboard/screen-reader
// navigation works exactly like a standard tablist (WAI-ARIA APG "tabs",
// automatic activation on arrow keys) — the 3D rotation is a visual layer
// on top of that, not a replacement for it.

const N = TABS.length; // 6 — one face per tab, a true cube
const FACE_W = 168;
const FACE_H = 56;
const RADIUS = Math.round(FACE_W / 2 / Math.tan(Math.PI / N));

export default function CubeNav({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (id: string) => void;
}) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activeIndex = Math.max(
    0,
    TABS.findIndex((t) => t.id === active)
  );

  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    scene.style.transform = `rotateY(${-activeIndex * (360 / N)}deg)`;
  }, [activeIndex]);

  const goTo = (index: number) => {
    const wrapped = ((index % N) + N) % N;
    const tab = TABS[wrapped];
    onSelect(tab.id);
    buttonRefs.current[wrapped]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(index - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      goTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      goTo(N - 1);
    }
  };

  const activeTab = TABS[activeIndex];

  return (
    <div className="flex flex-col items-center gap-1.5 border-b border-[#1c2621] bg-[#0a0e0c] px-4 py-2.5">
      <div
        role="tablist"
        aria-label="Sections"
        className="flex items-center gap-3"
      >
        <button
          type="button"
          onClick={() => goTo(activeIndex - 1)}
          aria-label="Previous section"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#1c2621] text-[#63706a] transition-colors hover:border-[#39ff8e]/40 hover:text-[#39ff8e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#39ff8e]"
        >
          <ChevronLeft size={16} />
        </button>

        <div
          className="relative shrink-0 max-sm:scale-[0.78]"
          style={{ width: FACE_W, height: FACE_H, perspective: 700 }}
        >
          <div
            ref={sceneRef}
            className="absolute inset-0"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateY(${-activeIndex * (360 / N)}deg)`,
              transition: reducedMotion ? "none" : "transform 420ms cubic-bezier(.2,.8,.2,1)",
            }}
          >
            {TABS.map((tab, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={tab.id}
                  ref={(el) => {
                    buttonRefs.current[i] = el;
                  }}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`tabpanel-${tab.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => goTo(i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={`absolute inset-0 flex flex-col items-center justify-center gap-1.5 rounded-lg border font-mono text-[11px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#39ff8e] ${
                    isActive
                      ? "border-[#39ff8e]/40 bg-[#0d1310] text-[#c9d1d9]"
                      : "border-[#1c2621] bg-[#101713] text-[#63706a] hover:text-[#8b978f]"
                  }`}
                  style={{
                    transform: `rotateY(${i * (360 / N)}deg) translateZ(${RADIUS}px)`,
                    backfaceVisibility: "hidden",
                    // Only the front-facing tab should be able to catch a
                    // click/tap — the rest are pushed off in 3D space by
                    // translateZ and can otherwise land visually on top of
                    // (and steal pointer events from) neighboring controls.
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: langColor[tab.lang] }}
                  />
                  <span className="max-w-[85%] truncate px-1">{tab.fileName}</span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={() => goTo(activeIndex + 1)}
          aria-label="Next section"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#1c2621] text-[#63706a] transition-colors hover:border-[#39ff8e]/40 hover:text-[#39ff8e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#39ff8e]"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] text-[#556058]">
          face {activeIndex + 1}/{N} — {activeTab.fileName}
        </span>
        <div className="flex items-center gap-1.5">
          {TABS.map((tab, i) => (
            <button
              key={tab.id}
              type="button"
              title={tab.fileName}
              aria-label={`Jump to ${tab.fileName}`}
              onClick={() => goTo(i)}
              className="h-1.5 w-1.5 rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#39ff8e]"
              style={{
                background: i === activeIndex ? langColor[tab.lang] : "#1c2621",
                transform: i === activeIndex ? "scale(1.4)" : "scale(1)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
