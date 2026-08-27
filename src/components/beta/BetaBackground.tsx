"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Deep-water ambient WebGL background for /beta — a slow drift of glowing
// particulate hanging in fog, lit from the top-left, with the camera
// travelling downward as you scroll (so each section feels like sinking a
// little deeper). Inspired by the underwater ambience of activetheory.net.
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

export default function BetaBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const COUNT = coarse ? 500 : 1100;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x05080a, 1);
    mount.appendChild(renderer.domElement);

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

    // central "spine" — a double helix of brighter points with faint
    // cross-rungs, running the full depth of the descent. An abstract
    // nod to the vertebral column on activetheory.net's work page.
    const spine = new THREE.Group();
    const SEG = 240;
    const HELIX_R = 2.3;
    const TWIST = 0.42;
    const strandPos = new Float32Array(SEG * 2 * 3);
    const strandCol = new Float32Array(SEG * 2 * 3);
    const rungVerts: number[] = [];
    const spineTints = [0x39ff8e, 0x6cb6ff, 0xa07bff];
    for (let i = 0; i < SEG; i++) {
      const y = 12 - (i / (SEG - 1)) * (DEPTH_SPAN + 10);
      const a = y * TWIST;
      for (let s = 0; s < 2; s++) {
        const phase = a + s * Math.PI;
        const idx = (i * 2 + s) * 3;
        strandPos[idx] = Math.sin(phase) * HELIX_R;
        strandPos[idx + 1] = y;
        strandPos[idx + 2] = Math.cos(phase) * HELIX_R;
        color.setHex(spineTints[(i + s) % spineTints.length]);
        const glow = 0.5 + 0.5 * Math.abs(Math.sin(a * 0.5));
        strandCol[idx] = color.r * glow;
        strandCol[idx + 1] = color.g * glow;
        strandCol[idx + 2] = color.b * glow;
      }
      if (i % 5 === 0) {
        rungVerts.push(
          Math.sin(a) * HELIX_R, y, Math.cos(a) * HELIX_R,
          Math.sin(a + Math.PI) * HELIX_R, y, Math.cos(a + Math.PI) * HELIX_R
        );
      }
    }
    const strandGeo = new THREE.BufferGeometry();
    strandGeo.setAttribute("position", new THREE.BufferAttribute(strandPos, 3));
    strandGeo.setAttribute("color", new THREE.BufferAttribute(strandCol, 3));
    const strandMat = new THREE.PointsMaterial({
      size: 0.34,
      map: mat.map,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    spine.add(new THREE.Points(strandGeo, strandMat));

    const rungGeo = new THREE.BufferGeometry();
    rungGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(rungVerts), 3));
    const rungMat = new THREE.LineBasicMaterial({
      color: 0x6cb6ff,
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    spine.add(new THREE.LineSegments(rungGeo, rungMat));
    spine.position.z = -2;
    scene.add(spine);

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
      spine.rotation.y = t * 0.06;

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
      strandGeo.dispose();
      rungGeo.dispose();
      mat.map?.dispose();
      mat.dispose();
      bMat.dispose();
      strandMat.dispose();
      rungMat.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <div ref={mountRef} className="absolute inset-0" />
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
