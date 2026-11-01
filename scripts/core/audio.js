let ctx = null;
let muted = false;

function getCtx() {
  if (ctx) return ctx;
  if (typeof window === 'undefined') return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  return ctx;
}

// Call once after the first user gesture to satisfy autoplay policies
export function unlockAudio() {
  const c = getCtx();
  if (c && c.state === "suspended") c.resume();
}

export function setMuted(v) { muted = !!v; }

function note(freq, dur, delay = 0, type = "sine", vol = 0.08) {
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(vol, t0);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

const SOUNDS = {
  correct: () => { note(523.25, 0.08); note(659.25, 0.12, 0.08); },
  wrong: () => { note(349.23, 0.10); note(329.63, 0.18, 0.09); },
  fanfare: () => { note(523.25, 0.10); note(783.99, 0.12, 0.10); note(1046.5, 0.25, 0.22); },
  tick: () => note(880, 0.03, 0, "square", 0.03),
  badge: () => { note(659.25, 0.08); note(880, 0.08, 0.08); note(1318.5, 0.2, 0.16); },
};

export function play(name) {
  if (muted) return;
  try { SOUNDS[name]?.(); } catch {}
}
