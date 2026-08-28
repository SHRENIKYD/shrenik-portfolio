// One audio engine for the whole site. Always on — there is no toggle.
//
// Two scenes use it: the loader ("Dead air" — an enormous near-silent room
// that gets cut to nothing at the burst) and the contact takeover
// ("Terminal" — dry relay clicks and keycap thocks as the neon ignites).
//
// Rules that hold everywhere:
//   · prefers-reduced-motion means silent — both scenes skip their
//     animation there anyway, so there would be nothing to score
//   · every sound is synthesized; there are no audio files to download
//   · browsers refuse to start audio before the visitor has interacted with
//     the page, so the context is armed on the first gesture of any kind.
//     The contact screen always follows a click and therefore always
//     sounds; the loader sounds whenever the browser permits it.

const MASTER_LEVEL = 0.6;

type BedBuild = (ctx: AudioContext, out: GainNode) => AudioScheduledSourceNode[];

export type Bed = {
  set: (v: number) => void;
  cut: () => void;
  stop: (fade?: number) => void;
};

let ac: AudioContext | null = null;
let master: GainNode | null = null;
let dryBus: GainNode | null = null;
let wetBus: GainNode | null = null;
let verb: ConvolverNode | null = null;
let noiseBuf: AudioBuffer | null = null;
let liveBeds: Bed[] = [];

/* ---------------------------------------------------------------- state */

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Browsers refuse to start audio before the visitor has interacted with the
// page, so on a cold load the context exists but is suspended. Resume it on
// the first gesture of any kind — after that everything sounds normally.
export function armOnGesture(): void {
  if (typeof window === "undefined") return;
  const go = () => ensure();
  (["pointerdown", "keydown", "touchstart"] as const).forEach((evt) =>
    window.addEventListener(evt, go, { once: true, passive: true })
  );
}

/* ----------------------------------------------------------------- core */

function makeRoomIR(ctx: AudioContext, seconds: number, decay: number): AudioBuffer {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
  }
  return buf;
}

function ensure(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (prefersReducedMotion()) return null;
  if (!ac) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ac = new Ctor();

    const comp = ac.createDynamicsCompressor();
    comp.threshold.value = -20;
    comp.ratio.value = 6;
    comp.attack.value = 0.006;
    comp.release.value = 0.22;

    master = ac.createGain();
    master.gain.value = MASTER_LEVEL;

    // the big slow room — the difference between "a website made a noise"
    // and "a space opened up"
    verb = ac.createConvolver();
    verb.buffer = makeRoomIR(ac, 3.6, 2.6);
    wetBus = ac.createGain();
    wetBus.gain.value = 0.9;
    dryBus = ac.createGain();
    dryBus.gain.value = 1;

    dryBus.connect(master);
    verb.connect(wetBus);
    wetBus.connect(master);
    master.connect(comp);
    comp.connect(ac.destination);
  }
  if (ac.state === "suspended") void ac.resume();
  return ac;
}

// A suspended context has a FROZEN clock: anything scheduled against it is
// queued and then fires in a heap the instant it resumes, which lands the
// whole score after the animation it was meant to follow. So every sound
// goes through here — if the context is not actually running, the sound is
// dropped rather than deferred. Silence beats late.
function ready(): AudioContext | null {
  const ctx = ensure();
  return ctx && ctx.state === "running" ? ctx : null;
}

/** split a source between the dry path and the room, 0 = dry, 1 = drenched */
function send(ctx: AudioContext, node: AudioNode, wetAmt: number): void {
  if (!dryBus || !verb) return;
  const d = ctx.createGain();
  d.gain.value = 1 - wetAmt * 0.75;
  node.connect(d);
  d.connect(dryBus);
  const s = ctx.createGain();
  s.gain.value = wetAmt;
  node.connect(s);
  s.connect(verb);
}

function noiseSource(ctx: AudioContext): AudioBufferSourceNode {
  if (!noiseBuf) {
    const len = Math.floor(ctx.sampleRate * 2);
    noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  }
  const src = ctx.createBufferSource();
  src.buffer = noiseBuf;
  src.loop = true;
  return src;
}

/** a struck, decaying pitch — slow attack, long tail */
function struck(
  freq: number,
  peak: number,
  dur: number,
  wetAmt = 0.5,
  type: OscillatorType = "sine",
  delay = 0,
  glideTo?: number
): void {
  const ctx = ready();
  if (!ctx) return;
  const t = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t + dur);
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(Math.min(8000, freq * 6), t);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + 0.022);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(lp);
  lp.connect(g);
  send(ctx, g, wetAmt);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

/** a shaped band of noise — clicks, thuds, whooshes */
function air(
  freq: number,
  q: number,
  peak: number,
  dur: number,
  ftype: BiquadFilterType = "bandpass",
  wetAmt = 0.4,
  delay = 0
): void {
  const ctx = ready();
  if (!ctx) return;
  const t = ctx.currentTime + delay;
  const src = noiseSource(ctx);
  const f = ctx.createBiquadFilter();
  f.type = ftype;
  f.frequency.setValueAtTime(freq, t);
  f.Q.value = q;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + Math.min(0.12, dur * 0.3));
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f);
  f.connect(g);
  send(ctx, g, wetAmt);
  src.start(t);
  src.stop(t + dur + 0.05);
}

function bed(build: BedBuild, wetAmt = 0.4): Bed | null {
  const ctx = ready();
  if (!ctx) return null;
  const g = ctx.createGain();
  g.gain.value = 0.0001;
  const parts = build(ctx, g);
  send(ctx, g, wetAmt);

  const handle: Bed = {
    set(v) {
      const now = ctx.currentTime;
      g.gain.cancelScheduledValues(now);
      g.gain.setTargetAtTime(Math.max(0.0001, v), now, 0.1);
    },
    cut() {
      const now = ctx.currentTime;
      g.gain.cancelScheduledValues(now);
      g.gain.setTargetAtTime(0.0001, now, 0.012);
    },
    stop(fade = 0.9) {
      const now = ctx.currentTime;
      g.gain.cancelScheduledValues(now);
      g.gain.setTargetAtTime(0.0001, now, fade / 3);
      window.setTimeout(() => {
        parts.forEach((n) => {
          try {
            n.stop();
          } catch {
            /* already stopped */
          }
        });
        try {
          g.disconnect();
        } catch {
          /* already detached */
        }
      }, (fade + 0.5) * 1000);
      liveBeds = liveBeds.filter((b) => b !== handle);
    },
  };
  liveBeds.push(handle);
  return handle;
}

export function stopAllSound(): void {
  liveBeds.slice().forEach((b) => b.stop(0.25));
  liveBeds = [];
}

/* ------------------------------------------------- loader — "Dead air" */
// Restraint as the effect. A vast, almost inaudible room; three or four
// small dry ticks in the whole run; and the burst is not a sound at all
// but the room being cut to absolute silence, with one soft tone in the gap.

let room: Bed | null = null;
let bootTicks = 0;
let bootRunning = false;

function openRoom(): void {
  if (room) return;
  room = bed((ctx, out) => {
    const src = noiseSource(ctx);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 190;
    lp.Q.value = 0.7;
    src.connect(lp);
    lp.connect(out);
    src.start();
    return [src];
  }, 0.95);
  room?.set(0.03);
}

export const boot = {
  begin(): void {
    bootTicks = 0;
    bootRunning = true;
    ensure(); // ask for the context; it may still be blocked
    openRoom(); // no-op while suspended — see progress()
  },

  progress(p: number): void {
    if (!bootRunning) return;
    // If the visitor clicks partway through, audio unblocks mid-run: open
    // the room at that moment and score the rest in sync, rather than
    // replaying a backlog of sounds whose moment has passed.
    if (!room) openRoom();
    room?.set(0.03 + p * 0.03);
  },

  /** one call per typed burst — only every ninth is audible, and barely */
  key(): void {
    bootTicks += 1;
    if (bootTicks % 9 !== 0) return;
    air(1800, 9, 0.03, 0.012, "bandpass", 0.15);
  },

  implode(): void {
    struck(73.4, 0.13, 1.1, 0.85);
  },

  burst(): void {
    room?.cut(); // the hole
    struck(587.3, 0.055, 2.4, 0.9, "sine", 0.42);
  },

  settle(): void {
    bootRunning = false;
    room?.stop(1.4);
    room = null;
  },
};

/* ---------------------------------------------- contact — "Terminal" */
// Mechanical and dry, the IDE version's soul: a relay click for every
// flicker, a keycap thock as each character locks, a faint fan bed once
// the sign holds, and an old-CRT collapse on the way out.

let hum: Bed | null = null;

export const contact = {
  powerOn(): void {
    air(150, 1.5, 0.3, 0.08, "bandpass", 0.2);
    struck(60, 0.12, 0.15, 0.2, "square");
  },

  flicker(): void {
    air(4000, 3, 0.06, 0.015, "bandpass", 0.1);
  },

  lock(): void {
    struck(150, 0.12, 0.05, 0.15);
    air(2000, 2, 0.08, 0.02, "bandpass", 0.1);
  },

  faulty(): void {
    air(5000, 4, 0.04, 0.012, "bandpass", 0.1);
  },

  hover(): void {
    air(3000, 5, 0.05, 0.02, "bandpass", 0.12);
  },

  humStart(): void {
    if (hum) return;
    hum = bed((ctx, out) => {
      const src = noiseSource(ctx);
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 180;
      src.connect(lp);
      lp.connect(out);
      src.start();
      return [src];
    }, 0.2);
    hum?.set(0.05);
  },

  powerOff(): void {
    struck(1800, 0.08, 0.25, 0.15, "square", 0, 60);
    air(120, 1, 0.2, 0.15, "lowpass", 0.25);
    // the bed teardown must run even if the sounds themselves were dropped
    hum?.stop(0.35);
    hum = null;
  },

  stop(): void {
    hum?.stop(0.3);
    hum = null;
  },
};
