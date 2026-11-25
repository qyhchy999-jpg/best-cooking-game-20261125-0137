// Sizzle & Serve — the kitchen rules. One job: the whole game state and what the
// player can do to it. No drawing, no input, no sound here — render.js and input.js
// talk to this file, and shots.js plays it forward with a scripted hand.

import {
  BIN_ORDER, CHEF_SPEED, CHOPS_NEEDED, FRY_SECONDS, GRILL_SECONDS, BURN_SECONDS,
  INGREDIENTS, MAX_HEARTS, MAX_ORDERS, ORDER_PATIENCE, ORDER_SPAWN_EVERY,
  RECIPES, RECIPE_ORDER, SHIFT_SECONDS, STATIONS,
} from './config.js';
import { mulberry32, pick } from './random.js';

export function itemKey(item) {
  return item.prep === 'raw' ? item.kind : `${item.kind}:${item.prep}`;
}

export function makeItem(kind, prep = 'raw') {
  return { kind, prep };
}

export function createWorld(seed = 1) {
  const rng = mulberry32(seed);
  return {
    seed,
    rng,
    screen: 'title',
    time: 0,
    shiftLeft: SHIFT_SECONDS,
    coins: 0,
    combo: 0,
    bestCombo: 0,
    hearts: MAX_HEARTS,
    chef: { x: 640, y: 700, tx: 640, ty: 700, moving: false, hand: null, pending: null },
    orders: [],
    chop: { item: null, chops: 0 },
    grill: [{ item: null, t: 0 }, { item: null, t: 0 }],
    fryer: { item: null, t: 0 },
    plate: [],
    spawnTimer: 6,
    nextOrderId: 1,
    servedFlash: null,
    particles: [],
    actionCount: 0,
    lastAction: null,
    stats: { served: 0, lost: 0, earned: 0 },
    over: null,
  };
}

export function startShift(world) {
  world.screen = 'play';
  world.time = 0;
  world.shiftLeft = SHIFT_SECONDS;
  spawnOrder(world);
  spawnOrder(world);
}

export function spawnOrder(world) {
  if (world.orders.filter((o) => o.state === 'open').length >= MAX_ORDERS) return null;
  const recipe = pick(world.rng, RECIPE_ORDER);
  const order = { id: world.nextOrderId, recipe, left: ORDER_PATIENCE, state: 'open' };
  world.nextOrderId += 1;
  world.orders.push(order);
  return order;
}

function stationAt(x, y) {
  for (const s of STATIONS) {
    if (x >= s.x && x <= s.x + s.w && y >= s.y && y <= s.y + s.h) return s;
  }
  return null;
}

function binAt(x, y) {
  const bins = STATIONS[0];
  if (x < bins.x || x > bins.x + bins.w || y < bins.y || y > bins.y + bins.h) return null;
  const idx = Math.floor(((x - bins.x) / bins.w) * BIN_ORDER.length);
  return BIN_ORDER[Math.min(BIN_ORDER.length - 1, Math.max(0, idx))];
}

function usePoint(station) {
  // Stand clear below the station so the chef never covers what is on it.
  return { x: station.x + station.w / 2, y: station.y + station.h + 64 };
}

// The player clicked the floor: walk there. Clicked a station: walk to it, then use it.
export function clickAt(world, x, y) {
  if (world.screen !== 'play') return;
  const station = stationAt(x, y);
  const chef = world.chef;
  if (station) {
    const p = usePoint(station);
    chef.tx = p.x;
    chef.ty = p.y;
    chef.moving = true;
    chef.pending = { station: station.id, x, y };
  } else {
    chef.tx = Math.max(30, Math.min(1250, x));
    chef.ty = Math.max(120, Math.min(860, y));
    chef.moving = true;
    chef.pending = null;
  }
}

function grillState(slot) {
  if (!slot.item) return 'empty';
  if (slot.t >= BURN_SECONDS) return 'burnt';
  if (slot.t >= GRILL_SECONDS) return 'done';
  return 'cooking';
}

function fryerState(fryer) {
  if (!fryer.item) return 'empty';
  if (fryer.t >= BURN_SECONDS) return 'burnt';
  if (fryer.t >= FRY_SECONDS) return 'done';
  return 'cooking';
}

export function plateMatches(world) {
  const keys = world.plate.map(itemKey).sort().join('|');
  for (const order of world.orders) {
    if (order.state !== 'open') continue;
    const want = RECIPES[order.recipe].items.slice().sort().join('|');
    if (keys === want && keys.length > 0) return order;
  }
  return null;
}

function burst(world, x, y, color, n = 14) {
  for (let i = 0; i < n; i += 1) {
    world.particles.push({
      x, y,
      vx: (world.rng() - 0.5) * 260,
      vy: -60 - world.rng() * 180,
      life: 0.7 + world.rng() * 0.5,
      t: 0,
      color,
      r: 3 + world.rng() * 4,
    });
  }
}

export function serveMatched(world) {
  const order = plateMatches(world);
  if (!order) return false;
  const recipe = RECIPES[order.recipe];
  const tip = Math.ceil((order.left / ORDER_PATIENCE) * 6);
  const earned = recipe.coins + tip;
  world.coins += earned;
  world.stats.earned += earned;
  world.stats.served += 1;
  world.combo += 1;
  world.bestCombo = Math.max(world.bestCombo, world.combo);
  order.state = 'served';
  world.plate = [];
  const s = STATIONS.find((st) => st.id === 'serve');
  burst(world, s.x + s.w / 2, s.y + 40, '#ffd94a', 22);
  burst(world, s.x + s.w / 2, s.y + 40, '#7dc24a', 12);
  world.servedFlash = { text: `SERVED +$${earned}`, t: 0, dur: 1.6 };
  return true;
}

// One use of a station, run when the chef arrives. Returns a short label for sound.
export function useStation(world, stationId, x, y) {
  const chef = world.chef;
  const hand = chef.hand;
  if (stationId === 'bins') {
    const kind = binAt(x, y);
    if (kind && !hand) {
      chef.hand = makeItem(kind);
      return 'pickup';
    }
    return null;
  }
  if (stationId === 'chop') {
    const board = world.chop;
    if (board.item && !hand) {
      if (board.chops >= CHOPS_NEEDED) {
        chef.hand = makeItem(board.item.kind, 'chopped');
        world.chop = { item: null, chops: 0 };
        return 'pickup';
      }
      board.chops += 1;
      burst(world, 160, 375, '#d8f7b0', 6);
      return 'chop';
    }
    if (!board.item && hand && INGREDIENTS[hand.kind].needs === 'chop' && hand.prep === 'raw') {
      board.item = hand;
      board.chops = 0;
      chef.hand = null;
      return 'place';
    }
    return null;
  }
  if (stationId === 'grill') {
    for (const slot of world.grill) {
      const state = grillState(slot);
      if (slot.item && !hand && (state === 'done' || state === 'burnt')) {
        chef.hand = makeItem(slot.item.kind, state === 'done' ? 'grilled' : 'burnt');
        slot.item = null;
        slot.t = 0;
        return 'pickup';
      }
    }
    if (hand && INGREDIENTS[hand.kind].needs === 'grill' && hand.prep === 'raw') {
      const free = world.grill.find((s) => !s.item);
      if (free) {
        free.item = hand;
        free.t = 0;
        chef.hand = null;
        return 'place';
      }
    }
    return null;
  }
  if (stationId === 'fryer') {
    const state = fryerState(world.fryer);
    if (world.fryer.item && !hand && (state === 'done' || state === 'burnt')) {
      chef.hand = makeItem(world.fryer.item.kind, state === 'done' ? 'fried' : 'burnt');
      world.fryer.item = null;
      world.fryer.t = 0;
      return 'pickup';
    }
    if (hand && INGREDIENTS[hand.kind].needs === 'fry' && hand.prep === 'raw') {
      if (!world.fryer.item) {
        world.fryer.item = hand;
        world.fryer.t = 0;
        chef.hand = null;
        return 'place';
      }
    }
    return null;
  }
  if (stationId === 'plate') {
    if (hand && hand.prep !== 'burnt' && world.plate.length < 5) {
      world.plate.push(hand);
      chef.hand = null;
      return 'place';
    }
    if (!hand && world.plate.length > 0) {
      chef.hand = world.plate.pop();
      return 'pickup';
    }
    return null;
  }
  if (stationId === 'serve') {
    if (serveMatched(world)) return 'serve';
    return null;
  }
  if (stationId === 'trash') {
    if (hand) {
      chef.hand = null;
      return 'trash';
    }
    return null;
  }
  return null;
}

export function update(world, dt) {
  if (world.screen !== 'play') return;
  world.time += dt;
  world.shiftLeft = Math.max(0, world.shiftLeft - dt);
  if (world.servedFlash) {
    world.servedFlash.t += dt;
    if (world.servedFlash.t > world.servedFlash.dur) world.servedFlash = null;
  }
  for (const p of world.particles) {
    p.t += dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 420 * dt;
  }
  world.particles = world.particles.filter((p) => p.t < p.life);

  // Chef walks toward the target, then uses the station he was sent to.
  const chef = world.chef;
  if (chef.moving) {
    const dx = chef.tx - chef.x;
    const dy = chef.ty - chef.y;
    const dist = Math.hypot(dx, dy);
    const step = CHEF_SPEED * dt;
    if (dist <= step) {
      chef.x = chef.tx;
      chef.y = chef.ty;
      chef.moving = false;
      if (chef.pending) {
        const action = useStation(world, chef.pending.station, chef.pending.x, chef.pending.y);
        world.lastAction = action;
        world.actionCount += 1;
        chef.pending = null;
      }
    } else {
      chef.x += (dx / dist) * step;
      chef.y += (dy / dist) * step;
    }
  }

  // Cooking progresses.
  for (const slot of world.grill) if (slot.item) slot.t += dt;
  if (world.fryer.item) world.fryer.t += dt;

  // Orders: patience runs out, new ones arrive.
  for (const order of world.orders) {
    if (order.state !== 'open') continue;
    order.left -= dt;
    if (order.left <= 0) {
      order.state = 'lost';
      order.left = 0;
      world.stats.lost += 1;
      world.hearts -= 1;
      world.combo = 0;
    }
  }
  world.spawnTimer -= dt;
  if (world.spawnTimer <= 0) {
    spawnOrder(world);
    const open = world.orders.filter((o) => o.state === 'open').length;
    world.spawnTimer = Math.max(9, ORDER_SPAWN_EVERY - open * 1.5);
  }

  if (world.shiftLeft <= 0 || world.hearts <= 0) {
    world.screen = 'over';
    const served = world.stats.served;
    world.over = {
      stars: world.coins >= 120 ? 3 : world.coins >= 70 ? 2 : served >= 3 ? 1 : 0,
      reason: world.hearts <= 0 ? 'Too many walkouts — the dinner rush is over.' : 'Shift complete!',
    };
  }
}

export function resetWorld(world, seed = 1) {
  const fresh = createWorld(seed);
  Object.assign(world, fresh);
  world.rng = fresh.rng;
}
