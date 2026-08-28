"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// Deep-water ambient WebGL background for /beta — a slow drift of glowing
// particulate hanging in fog, plus "marine snow": glyphs sinking forever
// through the water column and settling as sediment on the seafloor at
// the bottom of the scroll. The camera travels downward as you scroll,
// so each section feels like sinking a little deeper.
//
// Deliberately restrained: no post-processing stack, one Points cloud +
// exponential fog + additive blending. Pauses off-tab, caps DPR at 2,
// drops particle count on coarse-pointer devices, and renders a single
// static frame under prefers-reduced-motion.

const COLORS = [0x39ff8e, 0x6cb6ff, 0x9fffce, 0xa07bff, 0xffffff];

function makeSpriteTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.45)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// Not every visitor has WebGL. In-app browsers (LinkedIn, Instagram),
// corporate machines with the GPU blocklisted, older phones and privacy
// setups that disable it for fingerprinting reasons all end up here — and
// three.js THROWS when it cannot create a context. Unhandled, that took the
// whole page down and showed a blank error screen instead of the portfolio.
function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function BetaBackground() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglDown, setWebglDown] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const COUNT = coarse ? 500 : 1100;

    if (!supportsWebGL()) {
      setWebglDown(true);
      return;
    }

    // The probe can pass and creation still fail — a blocklisted driver, an
    // exhausted context pool. Never let that escape into the render tree.
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    } catch {
      setWebglDown(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x05080a, 1);
    mount.appendChild(renderer.domElement);

    // a context can be lost at runtime too (backgrounded GPU, driver reset)
    const onContextLost = (e: Event) => {
      e.preventDefault();
      setWebglDown(true);
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05080a, 0.055);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 10);

    // particle cloud — a tall column the camera sinks through
    const DEPTH_SPAN = 120; // world-units of vertical travel space
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const seeds = new Float32Array(COUNT);
    const color = new THREE.Color();
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 44;
      positions[i * 3 + 1] = -Math.random() * DEPTH_SPAN + 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
      color.setHex(COLORS[(Math.random() * COLORS.length) | 0]);
      // mostly dim motes with the occasional bright fleck
      const dim = Math.random() < 0.85 ? 0.35 + Math.random() * 0.3 : 1;
      colors[i * 3] = color.r * dim;
      colors[i * 3 + 1] = color.g * dim;
      colors[i * 3 + 2] = color.b * dim;
      sizes[i] = 0.6 + Math.random() * 1.8;
      seeds[i] = Math.random() * Math.PI * 2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.28,
      map: makeSpriteTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // a second, sparser layer of larger, softer "bokeh" blobs for depth
    const BOKEH = coarse ? 40 : 90;
    const bPositions = new Float32Array(BOKEH * 3);
    const bColors = new Float32Array(BOKEH * 3);
    for (let i = 0; i < BOKEH; i++) {
      bPositions[i * 3] = (Math.random() - 0.5) * 50;
      bPositions[i * 3 + 1] = -Math.random() * DEPTH_SPAN + 10;
      bPositions[i * 3 + 2] = (Math.random() - 0.5) * 34;
      color.setHex(COLORS[(Math.random() * COLORS.length) | 0]);
      bColors[i * 3] = color.r * 0.18;
      bColors[i * 3 + 1] = color.g * 0.18;
      bColors[i * 3 + 2] = color.b * 0.18;
    }
    const bGeo = new THREE.BufferGeometry();
    bGeo.setAttribute("position", new THREE.BufferAttribute(bPositions, 3));
    bGeo.setAttribute("color", new THREE.BufferAttribute(bColors, 3));
    const bMat = new THREE.PointsMaterial({
      size: 2.6,
      map: mat.map,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const bokeh = new THREE.Points(bGeo, bMat);
    scene.add(bokeh);

    // marine snow — glyphs sinking forever through the water column,
    // settling into a faint sediment drift on the seafloor at the very
    // bottom of the scroll (the deep the camera reaches at Contact).
    const GLYPHS = ["/", "0", "1", "<", ">", "{", "}", ";", "=", "+"];
    const SNOW_PER = coarse ? 20 : 38; // falling glyphs per character
    const SED_PER = 12; // settled glyphs per character
    const FLOOR_TOP = -(DEPTH_SPAN - 20); // just below the camera's deepest stop
    const SNOW_RANGE = 12 - FLOOR_TOP;
    const makeGlyphTexture = (ch: string) => {
      const size = 64;
      const c = document.createElement("canvas");
      c.width = size;
      c.height = size;
      const g = c.getContext("2d")!;
      g.font = "600 44px ui-monospace, Menlo, monospace";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillStyle = "#ffffff";
      g.fillText(ch, size / 2, size / 2 + 2);
      return new THREE.CanvasTexture(c);
    };
    const snowTints = [0x7fa3b0, 0x7fa3b0, 0x7fa3b0, 0x39ff8e, 0x6cb6ff, 0xa07bff];
    interface SnowCloud {
      points: THREE.Points;
      geo: THREE.BufferGeometry;
      mat: THREE.PointsMaterial;
      tex: THREE.Texture;
      base: Float32Array;
      speed: Float32Array;
      phase: Float32Array;
      n: number;
    }
    const snowClouds: SnowCloud[] = GLYPHS.map((ch) => {
      const n = SNOW_PER + SED_PER;
      const pos = new Float32Array(n * 3);
      const col = new Float32Array(n * 3);
      const speed = new Float32Array(n);
      const phase = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        const settled = i >= SNOW_PER;
        // z stays well short of the camera (z=10) so no glyph ever
        // balloons across the screen as it passes the lens
        if (settled) {
          pos[i * 3] = (Math.random() - 0.5) * 52;
          pos[i * 3 + 1] = FLOOR_TOP - 2 - Math.random() * 4;
          pos[i * 3 + 2] = -18 + Math.random() * 22;
          speed[i] = 0;
        } else {
          pos[i * 3] = (Math.random() - 0.5) * 44;
          pos[i * 3 + 1] = FLOOR_TOP + Math.random() * SNOW_RANGE;
          pos[i * 3 + 2] = -18 + Math.random() * 22;
          speed[i] = 0.5 + Math.random() * 1.0;
        }
        phase[i] = Math.random() * Math.PI * 2;
        color.setHex(snowTints[(Math.random() * snowTints.length) | 0]);
        const dim = settled ? 0.22 : 0.4 + Math.random() * 0.4;
        col[i * 3] = color.r * dim;
        col[i * 3 + 1] = color.g * dim;
        col[i * 3 + 2] = color.b * dim;
      }
      const geo2 = new THREE.BufferGeometry();
      geo2.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo2.setAttribute("color", new THREE.BufferAttribute(col, 3));
      const tex = makeGlyphTexture(ch);
      const mat2 = new THREE.PointsMaterial({
        size: 0.6,
        map: tex,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        sizeAttenuation: true,
      });
      const points = new THREE.Points(geo2, mat2);
      scene.add(points);
      return { points, geo: geo2, mat: mat2, tex, base: pos.slice(), speed, phase, n };
    });

    // pointer parallax + scroll-driven descent
    const target = { x: 0, y: 0 };
    const onPointer = (e: MouseEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onPointer);

    let scrollProgress = 0;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = max > 0 ? window.scrollY / max : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    let rafId = 0;
    let running = true;
    const onVisibility = () => {
      const visible = !document.hidden;
      if (visible && !running && !reduceMotion) {
        running = true;
        rafId = requestAnimationFrame(tick);
      } else if (!visible) {
        running = false;
        cancelAnimationFrame(rafId);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const clock = new THREE.Clock();
    const basePositions = positions.slice();

    function tick() {
      const t = clock.getElapsedTime();

      // slow upward drift + sway, like suspended sediment
      const pos = geo.getAttribute("position") as THREE.BufferAttribute;
      for (let i = 0; i < COUNT; i++) {
        const seed = seeds[i];
        const bx = basePositions[i * 3];
        const by = basePositions[i * 3 + 1];
        pos.array[i * 3] = bx + Math.sin(t * 0.18 + seed) * 0.8;
        const y = by + t * 0.22 + Math.sin(t * 0.12 + seed * 2) * 0.3;
        // wrap into [10 - DEPTH_SPAN, 10] so the rising drift never
        // empties the column the camera sinks through
        pos.array[i * 3 + 1] = 10 - ((((10 - y) % DEPTH_SPAN) + DEPTH_SPAN) % DEPTH_SPAN);
      }
      pos.needsUpdate = true;

      // camera: sinks with scroll, parallaxes with the pointer
      const targetCamY = -scrollProgress * (DEPTH_SPAN - 25);
      camera.position.y += (targetCamY - camera.position.y) * 0.06;
      camera.position.x += (target.x * 1.4 - camera.position.x) * 0.03;
      const targetRotX = -target.y * 0.05;
      camera.rotation.x += (targetRotX - camera.rotation.x) * 0.03;
      camera.rotation.z += (target.x * -0.015 - camera.rotation.z) * 0.02;

      bokeh.rotation.y = t * 0.008;

      // marine snow: sink, sway, wrap back to the surface; sediment
      // (speed 0) stays put on the seafloor
      for (const cloud of snowClouds) {
        const attr = cloud.geo.getAttribute("position") as THREE.BufferAttribute;
        const arr = attr.array as Float32Array;
        for (let i = 0; i < cloud.n; i++) {
          const sp = cloud.speed[i];
          if (sp === 0) continue;
          const by = cloud.base[i * 3 + 1];
          const yRaw = by - t * sp;
          arr[i * 3 + 1] =
            FLOOR_TOP + ((((yRaw - FLOOR_TOP) % SNOW_RANGE) + SNOW_RANGE) % SNOW_RANGE);
          arr[i * 3] = cloud.base[i * 3] + Math.sin(t * 0.3 + cloud.phase[i]) * 1.1;
        }
        attr.needsUpdate = true;
      }

      renderer.render(scene, camera);
      if (running) rafId = requestAnimationFrame(tick);
    }

    if (reduceMotion) {
      renderer.render(scene, camera); // single static frame
    } else {
      rafId = requestAnimationFrame(tick);
    }

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onPointer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      geo.dispose();
      bGeo.dispose();
      for (const cloud of snowClouds) {
        cloud.geo.dispose();
        cloud.mat.dispose();
        cloud.tex.dispose();
      }
      mat.map?.dispose();
      mat.dispose();
      bMat.dispose();
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <div ref={mountRef} className="absolute inset-0" />
      {/* Stands in for the WebGL scene when there is no context. The light
          shafts below still paint over it, so the page keeps its depth
          instead of collapsing to flat black. */}
      {webglDown && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 120% 80% at 50% -20%, #0b1620 0%, #070d12 45%, #05080a 100%)," +
              "radial-gradient(ellipse 60% 40% at 80% 30%, rgba(60,110,140,0.10), transparent 60%)",
          }}
        />
      )}
      {/* volumetric light shaft from the top-left + depth vignette,
          done in cheap CSS on top of the WebGL layer */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 18% -12%, rgba(140,190,220,0.16), transparent 60%)," +
            "radial-gradient(ellipse 75% 50% at 15% 110%, rgba(110,70,190,0.13), transparent 55%)," +
            "radial-gradient(ellipse 90% 60% at 50% 115%, rgba(3,5,6,0.8), transparent 55%)",
        }}
      />
    </div>
  );
}
