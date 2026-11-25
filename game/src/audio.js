// Sizzle & Serve — sound. One job: tiny synthesized effects, no audio files.
// Everything is a short oscillator blip through one shared AudioContext.

let ctx = null;

function ensure() {
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      ctx = null;
    }
  }
  if (ctx && ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function blip(freq, dur, type = 'sine', gain = 0.08, slideTo = null) {
  const ac = ensure();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ac.currentTime);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, ac.currentTime + dur);
  g.gain.setValueAtTime(gain, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
  osc.connect(g);
  g.connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + dur);
}

const SOUNDS = {
  pickup: () => blip(520, 0.08, 'sine', 0.06, 700),
  place: () => blip(340, 0.08, 'triangle', 0.07, 260),
  chop: () => { blip(180, 0.06, 'square', 0.05); blip(120, 0.05, 'square', 0.04); },
  serve: () => { blip(660, 0.12, 'sine', 0.08); setTimeout(() => blip(880, 0.16, 'sine', 0.08), 90); },
  trash: () => blip(220, 0.12, 'sawtooth', 0.04, 90),
  burn: () => blip(140, 0.3, 'sawtooth', 0.05, 70),
};

export function playSound(name) {
  const fn = SOUNDS[name];
  if (fn) fn();
}
