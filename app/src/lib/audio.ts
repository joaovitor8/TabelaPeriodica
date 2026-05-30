/**
 * Som cósmico — WebAudio puro, sem libs externas.
 *
 * Três sonificações:
 *  • playSpectralLines(lines, opts) — cada nm vira um seno; mapeado 700nm→220Hz, 400nm→880Hz.
 *  • playZTone(z, opts)             — fallback para elementos sem linhas: 220 * 2^(z/24).
 *  • originPad(origin)              — drone ambiente por origem cósmica (retorna stop()).
 *
 * O AudioContext é lazy: criado só no primeiro gesto do usuário (Chrome bloqueia antes).
 */

import type { CosmicOrigin } from "@/src/data/elementsData";

let ctxSingleton: AudioContext | null = null;
let masterGain: GainNode | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (ctxSingleton && ctxSingleton.state !== "closed") return ctxSingleton;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  ctxSingleton = new Ctor();
  masterGain = ctxSingleton.createGain();
  masterGain.gain.value = 0.6;
  masterGain.connect(ctxSingleton.destination);
  return ctxSingleton;
}

/** Resume o contexto (gesto do usuário) e retorna-o. */
async function ensureCtx(): Promise<AudioContext | null> {
  const ctx = getCtx();
  if (!ctx) return null;
  if (ctx.state === "suspended") {
    try {
      await ctx.resume();
    } catch {
      return null;
    }
  }
  return ctx;
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function nmToHz(nm: number): number {
  // 700nm vermelho → 220Hz (A3); 400nm violeta → 880Hz (A5). Linear.
  const t = (700 - nm) / (700 - 400);
  return clamp(220 + t * 660, 110, 1320);
}

function zToHz(z: number): number {
  // 5 oitavas em ~118 elementos
  return 220 * Math.pow(2, z / 24);
}

interface PlayOpts {
  duration?: number; // segundos
  gain?: number;     // 0..1
}

/** Toca um conjunto de senos com envelope ADSR curto. */
export async function playSpectralLines(
  lines: number[],
  { duration = 2.2, gain = 0.22 }: PlayOpts = {},
): Promise<void> {
  const ctx = await ensureCtx();
  if (!ctx || !masterGain || lines.length === 0) return;

  const now = ctx.currentTime;
  const perVoice = gain / Math.max(1, Math.sqrt(lines.length));
  const attack = 0.06;
  const release = 0.8;

  const master = masterGain;
  lines.forEach((nm) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = nmToHz(nm);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(perVoice, now + attack);
    g.gain.linearRampToValueAtTime(perVoice * 0.5, now + duration - release);
    g.gain.linearRampToValueAtTime(0, now + duration);

    osc.connect(g).connect(master);
    osc.onended = () => {
      osc.disconnect();
      g.disconnect();
    };
    osc.start(now);
    osc.stop(now + duration + 0.05);
  });
}

/** Tom único para elementos sem dado espectral. */
export async function playZTone(
  z: number,
  { duration = 1.6, gain = 0.18 }: PlayOpts = {},
): Promise<void> {
  const ctx = await ensureCtx();
  if (!ctx || !masterGain) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = "triangle";
  osc.frequency.value = zToHz(z);

  const g = ctx.createGain();
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(gain, now + 0.05);
  g.gain.linearRampToValueAtTime(gain * 0.4, now + duration * 0.5);
  g.gain.linearRampToValueAtTime(0, now + duration);

  osc.connect(g).connect(masterGain);
  osc.onended = () => {
    osc.disconnect();
    g.disconnect();
  };
  osc.start(now);
  osc.stop(now + duration + 0.05);
}

/* ─── Pads ambientes por origem cósmica ───────────────────────── */

function getNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (noiseBuffer && noiseBuffer.sampleRate === ctx.sampleRate) return noiseBuffer;
  const len = ctx.sampleRate * 2;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * 0.6;
  noiseBuffer = buf;
  return buf;
}

interface PadRecipe {
  baseFreq: number;
  detune: number;     // cents
  type: OscillatorType;
  filterCut: number;  // Hz
  filterQ: number;
  noiseMix: number;   // 0..1
  lfoRate: number;    // Hz (0 = sem LFO)
  lfoDepth: number;   // amount sobre filter cutoff
  gain: number;
}

const PAD: Record<CosmicOrigin, PadRecipe> = {
  "big-bang":              { baseFreq:  55, detune:  7, type: "sine",     filterCut:  500, filterQ: 0.8, noiseMix: 0.06, lfoRate: 0.25, lfoDepth: 200, gain: 0.40 },
  "cosmic-ray-spallation": { baseFreq: 165, detune: 14, type: "sawtooth", filterCut: 1100, filterQ: 2.4, noiseMix: 0.40, lfoRate: 5.5,  lfoDepth: 600, gain: 0.22 },
  "stellar-fusion-low":    { baseFreq: 110, detune: 11, type: "sine",     filterCut:  700, filterQ: 1.2, noiseMix: 0.10, lfoRate: 0.5,  lfoDepth: 250, gain: 0.34 },
  "stellar-fusion-high":   { baseFreq: 147, detune: 13, type: "triangle", filterCut: 1300, filterQ: 1.4, noiseMix: 0.15, lfoRate: 0.9,  lfoDepth: 400, gain: 0.30 },
  "supernova":             { baseFreq:  82, detune: 22, type: "sawtooth", filterCut: 2200, filterQ: 3.0, noiseMix: 0.50, lfoRate: 6.5,  lfoDepth: 900, gain: 0.26 },
  "neutron-star-merger":   { baseFreq: 220, detune: 18, type: "square",   filterCut: 1700, filterQ: 2.8, noiseMix: 0.22, lfoRate: 12.0, lfoDepth: 700, gain: 0.20 },
  "white-dwarf-explosion": { baseFreq:  98, detune: 16, type: "sawtooth", filterCut: 1100, filterQ: 2.0, noiseMix: 0.32, lfoRate: 2.5,  lfoDepth: 450, gain: 0.24 },
  "human-made":            { baseFreq: 220, detune:  4, type: "square",   filterCut:  850, filterQ: 1.0, noiseMix: 0.03, lfoRate: 0.0,  lfoDepth: 0,   gain: 0.18 },
};

let noiseBuffer: AudioBuffer | null = null;
function getNoiseBuffer(ctx: AudioCtx): AudioBuffer {
  if (noiseBuffer && noiseBuffer.sampleRate === ctx.sampleRate) return noiseBuffer;
  const len = ctx.sampleRate * 2;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * 0.6;
  noiseBuffer = buf;
  return buf;
}

export interface PadHandle {
  stop: (fadeMs?: number) => void;
}

/** Cria um pad para a origem indicada. Retorna handle com stop() (fade-out). */
export async function originPad(origin: CosmicOrigin): Promise<PadHandle | null> {
  const ctx = await ensureCtx();
  if (!ctx || !masterGain) return null;

  const recipe = PAD[origin];
  const now = ctx.currentTime;
  const fadeIn = 0.6;

  const out = ctx.createGain();
  out.gain.setValueAtTime(0, now);
  out.gain.linearRampToValueAtTime(recipe.gain, now + fadeIn);
  out.connect(masterGain);

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = recipe.filterCut;
  filter.Q.value = recipe.filterQ;
  filter.connect(out);

  // 2 osciladores detunados
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  osc1.type = recipe.type;
  osc2.type = recipe.type;
  osc1.frequency.value = recipe.baseFreq;
  osc2.frequency.value = recipe.baseFreq;
  osc1.detune.value = -recipe.detune;
  osc2.detune.value = recipe.detune;

  const oscGain = ctx.createGain();
  oscGain.gain.value = 1 - recipe.noiseMix;
  osc1.connect(oscGain);
  osc2.connect(oscGain);
  oscGain.connect(filter);

  // Noise
  let noiseSrc: AudioBufferSourceNode | null = null;
  if (recipe.noiseMix > 0) {
    noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = getNoiseBuffer(ctx);
    noiseSrc.loop = true;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = recipe.noiseMix;
    noiseSrc.connect(noiseGain).connect(filter);
  }

  // LFO modulando o cutoff
  let lfo: OscillatorNode | null = null;
  let lfoGain: GainNode | null = null;
  if (recipe.lfoRate > 0) {
    lfo = ctx.createOscillator();
    lfo.frequency.value = recipe.lfoRate;
    lfoGain = ctx.createGain();
    lfoGain.gain.value = recipe.lfoDepth;
    lfo.connect(lfoGain).connect(filter.frequency);
  }

  osc1.start(now);
  osc2.start(now);
  if (noiseSrc) noiseSrc.start(now);
  if (lfo) lfo.start(now);

  let stopped = false;
  return {
    stop(fadeMs = 600) {
      if (stopped || !ctx) return;
      stopped = true;
      const t = ctx.currentTime;
      const fade = fadeMs / 1000;
      out.gain.cancelScheduledValues(t);
      out.gain.setValueAtTime(out.gain.value, t);
      out.gain.linearRampToValueAtTime(0, t + fade);
      const stopAt = t + fade + 0.05;
      try { osc1.stop(stopAt); } catch {}
      try { osc2.stop(stopAt); } catch {}
      try { noiseSrc?.stop(stopAt); } catch {}
      try { lfo?.stop(stopAt); } catch {}
    },
  };
}

/** Silencia tudo ao desligar o som global. */
export function muteAll(): void {
  const ctx = getCtx();
  if (!ctx || !masterGain) return;
  const t = ctx.currentTime;
  masterGain.gain.cancelScheduledValues(t);
  masterGain.gain.setValueAtTime(masterGain.gain.value, t);
  masterGain.gain.linearRampToValueAtTime(0, t + 0.2);
}

export function unmuteAll(): void {
  const ctx = getCtx();
  if (!ctx || !masterGain) return;
  const t = ctx.currentTime;
  masterGain.gain.cancelScheduledValues(t);
  masterGain.gain.setValueAtTime(masterGain.gain.value, t);
  masterGain.gain.linearRampToValueAtTime(0.6, t + 0.2);
}
