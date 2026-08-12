"use client";

import { useEffect, useMemo, useRef } from "react";

// A pure-CSS-3D isometric workstation — monitor, keyboard, mug, a plant —
// rendered with perspective/preserve-3d/translateZ, no WebGL. Tilts toward
// the cursor on fine-pointer devices; sits static otherwise (touch,
// prefers-reduced-motion). Two call sites: the boot-sequence intro
// ("hero") and the About tab, where it stands in for the avatar photo
// ("compact", optionally showing that same photo on the monitor screen).

const BASE_RX = 58;
const BASE_RZ = -42;

type Variant = "hero" | "compact";

export default function IsometricDesk({
  variant = "hero",
  avatarSrc,
  className = "",
}: {
  variant?: Variant;
  avatarSrc?: string;
  className?: string;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  const canTilt = useMemo(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  useEffect(() => {
    if (!canTilt) return;
    const stage = stageRef.current;
    const scene = sceneRef.current;
    if (!stage || !scene) return;

    const onMove = (e: MouseEvent) => {
      const r = stage.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      scene.style.transform = `rotateX(${BASE_RX - py * 10}deg) rotateZ(${
        BASE_RZ + px * 14
      }deg) translateY(-10px)`;
    };
    const onLeave = () => {
      scene.style.transform = `rotateX(${BASE_RX}deg) rotateZ(${BASE_RZ}deg) translateY(-10px)`;
    };
    stage.addEventListener("mousemove", onMove);
    stage.addEventListener("mouseleave", onLeave);
    return () => {
      stage.removeEventListener("mousemove", onMove);
      stage.removeEventListener("mouseleave", onLeave);
    };
  }, [canTilt]);

  const isHero = variant === "hero";
  // The scene is authored once at a fixed 320x200 footprint; the compact
  // placement just scales the rendered projection down and re-centers it,
  // rather than re-deriving every offset for a second size.
  const scale = isHero ? 1 : 0.5;

  return (
    <div
      ref={stageRef}
      aria-hidden="true"
      className={`relative flex shrink-0 items-center justify-center overflow-hidden ${className}`}
      style={{ perspective: 900 }}
    >
      <div style={{ transform: `scale(${scale})${isHero ? "" : " translateY(24px)"}` }}>

        <div
          ref={sceneRef}
          className="relative"
          style={{
            width: 320,
            height: 200,
            transformStyle: "preserve-3d",
            transform: `rotateX(${BASE_RX}deg) rotateZ(${BASE_RZ}deg) translateY(-10px)`,
            transition: canTilt ? "transform 80ms ease-out" : undefined,
          }}
        >
          {/* desk surface */}
          <div
            className="absolute rounded-md border"
            style={{
              width: 320,
              height: 200,
              background: "linear-gradient(135deg, #12201a, #0c1712)",
              borderColor: "#1c2f24",
            }}
          />

          {/* monitor housing */}
          <div
            className="absolute rounded border border-[#1c2621] bg-[#101713]"
            style={{
              width: 130,
              height: 82,
              left: 60,
              top: 30,
              transform: "translateZ(0px) rotateX(-90deg)",
              transformOrigin: "bottom",
            }}
          />

          {/* monitor screen */}
          <div
            className="absolute rounded border p-2"
            style={{
              width: 130,
              height: 82,
              left: 60,
              top: 30,
              background: "#060907",
              borderColor: "#22332a",
              transform: "translateZ(58px) rotateX(-90deg)",
              transformOrigin: "bottom",
              boxShadow: "0 0 24px rgba(57,255,142,0.18)",
            }}
          >
            {avatarSrc ? (
              <div className="flex h-full flex-col items-center justify-center gap-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatarSrc}
                  alt=""
                  className="h-9 w-9 rounded-full border border-[#39ff8e]/40 object-cover"
                />
                <div className="h-[3px] w-14 rounded-full bg-[#39ff8e]/70" />
                <div className="h-[3px] w-10 rounded-full bg-[#1c2621]" />
              </div>
            ) : (
              <>
                <div className="mb-1.5 flex gap-[3px]">
                  <span className="h-1 w-1 rounded-full bg-[#2a3a30]" />
                  <span className="h-1 w-1 rounded-full bg-[#2a3a30]" />
                  <span className="h-1 w-1 rounded-full bg-[#2a3a30]" />
                </div>
                <div className="mb-1 h-[3px] w-[55%] rounded-full bg-[#39ff8e]/80" />
                <div className="mb-1 h-[3px] w-[75%] rounded-full bg-[#6cb6ff]/70" />
                <div className="mb-1 h-[3px] w-[65%] rounded-full bg-[#1c2621]" />
                <div className="h-[3px] w-[40%] rounded-full bg-[#ff6ac1]/60" />
              </>
            )}
          </div>

          {/* monitor stand */}
          <div
            className="absolute border border-[#1c2621] bg-[#0d1310]"
            style={{
              width: 14,
              height: 20,
              left: 118,
              top: 108,
              transform: "translateZ(0px) rotateX(-90deg)",
              transformOrigin: "bottom",
            }}
          />

          {/* keyboard */}
          <div
            className="absolute rounded border border-[#1c2621] bg-[#0d1310]"
            style={{ width: 90, height: 34, left: 70, top: 130, transform: "translateZ(4px)" }}
          />

          {/* mug */}
          <div
            className="absolute"
            style={{
              width: 20,
              height: 20,
              left: 190,
              top: 130,
              background: "#ffb454",
              opacity: 0.85,
              borderRadius: "4px 4px 6px 6px",
              transform: "translateZ(14px)",
              boxShadow: "0 0 14px rgba(255,180,84,0.35)",
            }}
          />

          {/* plant */}
          <div
            className="absolute rounded"
            style={{
              width: 18,
              height: 16,
              left: 30,
              top: 150,
              background: "#2a1f1a",
              transform: "translateZ(8px)",
            }}
          />
          {[
            { left: 33, top: 126, rot: -18 },
            { left: 38, top: 124, rot: 6 },
            { left: 43, top: 127, rot: 24 },
          ].map((leaf, i) => (
            <div
              key={i}
              className="absolute"
              style={{ left: leaf.left, top: leaf.top, transform: "translateZ(8px)" }}
            >
              <div
                className="rounded-full bg-[#39ff8e]"
                style={{
                  width: 3,
                  height: 22,
                  transformOrigin: "bottom center",
                  transform: `rotate(${leaf.rot}deg)`,
                }}
              />
            </div>
          ))}

          {/* sticky notes */}
          {[
            { left: 100, rot: -6, bg: "#6cb6ff", label: "C#" },
            { left: 124, rot: 4, bg: "#ff6ac1", label: "NG" },
          ].map((note) => (
            <div
              key={note.label}
              className="absolute flex items-center justify-center rounded-sm text-[7px] font-bold text-[#0a0e0c]"
              style={{
                width: 20,
                height: 20,
                left: note.left,
                top: 20,
                background: note.bg,
                transform: `translateZ(59px) rotateX(-90deg) rotate(${note.rot}deg)`,
                transformOrigin: "bottom",
              }}
            >
              {note.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
