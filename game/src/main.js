// Sizzle & Serve — the game loop. One job: wire the world, the input, the sound and
// the canvas together, and run the frame. With ?shot=start|play|serve it builds one
// screenshot scene instead and paints a single frame.

import { VIEW } from './config.js';
import { createWorld, resetWorld, startShift, update } from './world.js';
import { attachInput } from './input.js';
import { render } from './render.js';
import { buildShot } from './shots.js';
import { playSound } from './audio.js';

const canvas = document.getElementById('game');
canvas.width = VIEW.width;
canvas.height = VIEW.height;
const ctx = canvas.getContext('2d');

const params = new URLSearchParams(window.location.search);
const shotName = params.get('shot');
const seed = Number(params.get('seed') || '1');

if (shotName) {
  const world = buildShot(shotName);
  if (world) {
    render(ctx, world, null);
    document.title = `Sizzle & Serve — shot ${shotName}`;
  } else {
    document.title = 'Sizzle & Serve — unknown shot';
  }
} else {
  const world = createWorld(seed);
  let hover = null;
  let last = performance.now();
  let seenActions = 0;

  attachInput(canvas, world, {
    onStart: () => {
      playSound('pickup');
      startShift(world);
    },
    onRestart: () => {
      resetWorld(world, seed);
      startShift(world);
    },
    onAction: (action) => {
      if (action) playSound(action);
    },
    onHover: (x, y) => {
      hover = { x, y };
    },
  });

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    update(world, dt);
    if (world.actionCount !== seenActions) {
      seenActions = world.actionCount;
      if (world.lastAction) playSound(world.lastAction);
    }
    render(ctx, world, hover);
    requestAnimationFrame(frame);
  }
  render(ctx, world, hover);
  requestAnimationFrame(frame);
}
