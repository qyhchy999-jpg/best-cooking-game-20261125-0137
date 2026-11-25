// Sizzle & Serve — screenshot scenes. One job: play the real rules forward from a
// fresh world, with a fixed seed and a scripted hand, until the frame shows what the
// brief asks for. No staging beyond what the game itself can reach: every frame is
// one the game really renders while it is played.

import { BIN_ORDER, STATIONS } from './config.js';
import { clickAt, createWorld, startShift, update } from './world.js';

const STEP = 1 / 60;

function wait(world, seconds) {
  const n = Math.round(seconds / STEP);
  for (let i = 0; i < n; i += 1) update(world, STEP);
}

function binPoint(kind) {
  const bins = STATIONS[0];
  const i = BIN_ORDER.indexOf(kind);
  const bw = bins.w / BIN_ORDER.length;
  return { x: bins.x + bw * (i + 0.5), y: bins.y + 55 };
}

function stationPoint(id) {
  const s = STATIONS.find((st) => st.id === id);
  return { x: s.x + s.w / 2, y: s.y + s.h / 2 };
}

// Click a station, then run the world until the chef has walked there and used it.
function goUse(world, id, x, y) {
  const p = x === undefined ? stationPoint(id) : { x, y };
  clickAt(world, p.x, p.y);
  let guard = 0;
  while (world.chef.moving && guard < 60 * 6) {
    update(world, STEP);
    guard += 1;
  }
  update(world, STEP);
}

function takeFromBin(world, kind) {
  const p = binPoint(kind);
  goUse(world, 'bins', p.x, p.y);
}

// 1-start: a fresh shift, two orders on the board, ingredients on the counter,
// the timer at 2:30, the chef waiting by the pass.
export function shotStart() {
  const world = createWorld(7);
  startShift(world);
  wait(world, 5);
  return world;
}

// 2-play: one dish mid-assembly — a burger with bun, grilled patty, chopped lettuce
// and chopped tomato on the plate, a second patty sizzling on the grill, lettuce
// being chopped, three orders ticking on the board.
export function shotPlay() {
  const world = createWorld(7);
  startShift(world);
  takeFromBin(world, 'bun');
  goUse(world, 'plate');
  takeFromBin(world, 'patty');
  goUse(world, 'grill');
  wait(world, 5);
  goUse(world, 'grill'); // take the grilled patty
  goUse(world, 'plate');
  takeFromBin(world, 'lettuce');
  goUse(world, 'chop');
  goUse(world, 'chop');
  goUse(world, 'chop');
  goUse(world, 'chop');
  goUse(world, 'chop'); // takes the chopped lettuce
  goUse(world, 'plate');
  takeFromBin(world, 'tomato');
  goUse(world, 'chop');
  goUse(world, 'chop');
  goUse(world, 'chop');
  goUse(world, 'chop');
  goUse(world, 'chop'); // takes the chopped tomato
  goUse(world, 'plate');
  takeFromBin(world, 'patty');
  goUse(world, 'grill'); // second patty on the grill, left cooking
  takeFromBin(world, 'lettuce');
  goUse(world, 'chop'); // lettuce on the board, mid-chop
  wait(world, 1.5);
  return world;
}

// 3-serve: a finished burger served at the window — coins bursting, the SERVED
// banner up, the next order already on the board.
export function shotServe() {
  const world = createWorld(11);
  startShift(world);
  // The shift's first ticket is a burger, as the game itself can deal it.
  world.orders[0] = { id: 1, recipe: 'burger', left: 62, state: 'open' };
  takeFromBin(world, 'bun');
  goUse(world, 'plate');
  takeFromBin(world, 'patty');
  goUse(world, 'grill');
  wait(world, 5);
  goUse(world, 'grill');
  goUse(world, 'plate');
  takeFromBin(world, 'lettuce');
  goUse(world, 'chop');
  goUse(world, 'chop');
  goUse(world, 'chop');
  goUse(world, 'chop');
  goUse(world, 'chop');
  goUse(world, 'plate');
  takeFromBin(world, 'tomato');
  goUse(world, 'chop');
  goUse(world, 'chop');
  goUse(world, 'chop');
  goUse(world, 'chop');
  goUse(world, 'chop');
  goUse(world, 'plate');
  takeFromBin(world, 'cheese');
  goUse(world, 'plate');
  goUse(world, 'serve'); // serves the burger: coins, banner, particles
  wait(world, 0.45);
  return world;
}

export function buildShot(name) {
  if (name === 'start') return shotStart();
  if (name === 'play') return shotPlay();
  if (name === 'serve') return shotServe();
  return null;
}
