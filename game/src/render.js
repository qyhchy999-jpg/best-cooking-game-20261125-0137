// Sizzle & Serve — drawing. One job: everything the player sees, on one canvas.
// Big flat shapes and bold labels, so the kitchen still reads when a screenshot is
// shrunk to a contact sheet. No images, no fonts from the network: canvas shapes
// and the system sans-serif stack only.

import { BIN_ORDER, INGREDIENTS, RECIPES, STATIONS, VIEW } from './config.js';
import { itemKey } from './world.js';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function text(ctx, s, x, y, size, color, weight = 700, align = 'left') {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px system-ui, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(s, x, y);
}

// --- food -----------------------------------------------------------------

export function drawItem(ctx, item, x, y, size) {
  const s = size;
  const c = INGREDIENTS[item.kind];
  ctx.save();
  ctx.translate(x, y);
  if (item.prep === 'burnt') {
    ctx.fillStyle = '#22201e';
    roundRect(ctx, -s / 2, -s / 3, s, s * 0.66, s * 0.18);
    ctx.fill();
    ctx.fillStyle = '#555';
    text(ctx, '✕', 0, 0, s * 0.5, '#888', 800, 'center');
    ctx.restore();
    return;
  }
  if (item.kind === 'bun') {
    ctx.fillStyle = c.color;
    ctx.beginPath();
    ctx.arc(0, s * 0.08, s * 0.46, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = c.dark;
    ctx.fillRect(-s * 0.46, s * 0.08, s * 0.92, s * 0.2);
    ctx.fillStyle = '#fff8e0';
    ctx.beginPath(); ctx.arc(-s * 0.2, -s * 0.16, s * 0.05, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.14, -s * 0.22, s * 0.05, 0, 7); ctx.fill();
  } else if (item.kind === 'patty') {
    ctx.fillStyle = item.prep === 'grilled' ? '#6b4226' : c.color;
    roundRect(ctx, -s / 2, -s * 0.22, s, s * 0.44, s * 0.16);
    ctx.fill();
    if (item.prep === 'grilled') {
      ctx.strokeStyle = '#3d2412';
      ctx.lineWidth = s * 0.06;
      for (let i = -1; i <= 1; i += 1) {
        ctx.beginPath(); ctx.moveTo(i * s * 0.28, -s * 0.2); ctx.lineTo(i * s * 0.28, s * 0.2); ctx.stroke();
      }
    }
  } else if (item.kind === 'lettuce') {
    ctx.fillStyle = c.color;
    ctx.beginPath();
    for (let i = 0; i < 5; i += 1) {
      const a = (i / 5) * Math.PI * 2;
      ctx.ellipse(Math.cos(a) * s * 0.26, Math.sin(a) * s * 0.18, s * 0.24, s * 0.16, a, 0, 7);
    }
    ctx.fill();
    ctx.fillStyle = c.dark;
    ctx.beginPath(); ctx.arc(0, 0, s * 0.12, 0, 7); ctx.fill();
    if (item.prep === 'chopped') {
      ctx.strokeStyle = c.dark; ctx.lineWidth = s * 0.05;
      ctx.beginPath(); ctx.moveTo(-s * 0.3, 0); ctx.lineTo(s * 0.3, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -s * 0.28); ctx.lineTo(0, s * 0.28); ctx.stroke();
    }
  } else if (item.kind === 'tomato') {
    ctx.fillStyle = c.color;
    ctx.beginPath(); ctx.arc(0, 0, s * 0.44, 0, 7); ctx.fill();
    ctx.fillStyle = '#ff8a70';
    ctx.beginPath(); ctx.arc(0, 0, s * 0.3, 0, 7); ctx.fill();
    ctx.fillStyle = '#ffd9d0';
    for (let i = 0; i < 4; i += 1) {
      const a = (i / 4) * Math.PI * 2 + 0.4;
      ctx.beginPath(); ctx.ellipse(Math.cos(a) * s * 0.16, Math.sin(a) * s * 0.16, s * 0.1, s * 0.06, a, 0, 7); ctx.fill();
    }
    if (item.prep === 'chopped') {
      ctx.strokeStyle = '#fff'; ctx.lineWidth = s * 0.05;
      ctx.beginPath(); ctx.moveTo(-s * 0.4, 0); ctx.lineTo(s * 0.4, 0); ctx.stroke();
    }
  } else if (item.kind === 'cheese') {
    ctx.fillStyle = c.color;
    ctx.beginPath();
    ctx.moveTo(-s * 0.46, s * 0.3); ctx.lineTo(s * 0.46, s * 0.3); ctx.lineTo(0, -s * 0.36); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = c.dark;
    ctx.beginPath(); ctx.arc(-s * 0.12, s * 0.08, s * 0.06, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.16, -s * 0.08, s * 0.06, 0, 7); ctx.fill();
  } else if (item.kind === 'dough') {
    ctx.fillStyle = item.prep === 'grilled' ? '#e0a44f' : c.color;
    ctx.beginPath(); ctx.ellipse(0, 0, s * 0.48, s * 0.34, 0, 0, 7); ctx.fill();
    ctx.fillStyle = item.prep === 'grilled' ? '#b97f2e' : c.dark;
    ctx.beginPath(); ctx.arc(-s * 0.16, -s * 0.05, s * 0.05, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.18, s * 0.06, s * 0.05, 0, 7); ctx.fill();
  } else if (item.kind === 'pepperoni') {
    ctx.fillStyle = c.color;
    ctx.beginPath(); ctx.arc(0, 0, s * 0.44, 0, 7); ctx.fill();
    ctx.fillStyle = '#e88';
    ctx.beginPath(); ctx.arc(-s * 0.14, -s * 0.1, s * 0.1, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.16, s * 0.1, s * 0.1, 0, 7); ctx.fill();
    if (item.prep === 'chopped') {
      ctx.strokeStyle = '#fff'; ctx.lineWidth = s * 0.05;
      ctx.beginPath(); ctx.moveTo(-s * 0.42, -s * 0.2); ctx.lineTo(s * 0.42, s * 0.2); ctx.stroke();
    }
  } else if (item.kind === 'fries') {
    ctx.fillStyle = '#d9382b';
    ctx.beginPath();
    ctx.moveTo(-s * 0.4, -s * 0.1); ctx.lineTo(s * 0.4, -s * 0.1); ctx.lineTo(s * 0.3, s * 0.42); ctx.lineTo(-s * 0.3, s * 0.42); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = c.color;
    for (let i = -2; i <= 2; i += 1) ctx.fillRect(i * s * 0.14 - s * 0.05, -s * 0.48, s * 0.1, s * 0.5);
    if (item.prep === 'fried') {
      ctx.fillStyle = '#b97f2e';
      ctx.fillRect(-s * 0.2, -s * 0.48, s * 0.08, s * 0.14);
    }
  }
  ctx.restore();
}

// --- kitchen ---------------------------------------------------------------

function drawFloor(ctx) {
  ctx.fillStyle = '#3a2e22';
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);
  // Wall tiles up top.
  ctx.fillStyle = '#f3e2c7';
  ctx.fillRect(0, 0, VIEW.width, 64);
  ctx.fillStyle = '#e0c9a0';
  for (let x = 0; x < VIEW.width; x += 64) ctx.fillRect(x, 60, 64, 4);
  // Floor checkerboard.
  for (let y = 0; y < 14; y += 1) {
    for (let x = 0; x < 20; x += 1) {
      ctx.fillStyle = (x + y) % 2 === 0 ? '#4a3a2a' : '#423322';
      ctx.fillRect(x * 64, 660 + y * 20, 64, 20);
    }
  }
  ctx.fillStyle = '#7a2e2e';
  roundRect(ctx, 440, 700, 400, 150, 18);
  ctx.fill();
  ctx.fillStyle = '#93393a';
  roundRect(ctx, 456, 716, 368, 118, 12);
  ctx.fill();
}

function drawHUD(ctx, world) {
  ctx.fillStyle = '#2c1e12';
  ctx.fillRect(0, 0, VIEW.width, 64);
  text(ctx, 'SIZZLE & SERVE', 24, 34, 30, '#ffc93c');
  const mm = Math.floor(world.shiftLeft / 60);
  const ss = Math.floor(world.shiftLeft % 60).toString().padStart(2, '0');
  const low = world.shiftLeft < 30 && world.screen === 'play';
  text(ctx, `⏱ ${mm}:${ss}`, 640, 34, 30, low ? '#ff5a4e' : '#ffffff', 800, 'center');
  text(ctx, `💰 $${world.coins}`, 1000, 34, 26, '#ffd94a', 800, 'center');
  text(ctx, '♥'.repeat(Math.max(0, world.hearts)) + '♡'.repeat(Math.max(0, 3 - world.hearts)), 1140, 34, 26, '#ff6b81', 800, 'center');
  if (world.combo >= 2) text(ctx, `COMBO ×${world.combo}`, 880, 34, 22, '#7dc24a', 800, 'center');
}

function drawOrders(ctx, world) {
  text(ctx, 'ORDER BOARD', 24, 80, 15, '#c9a86a', 800);
  const open = world.orders.filter((o) => o.state === 'open');
  if (open.length === 0 && world.screen === 'play') text(ctx, 'No orders yet — the lunch rush is coming…', 200, 116, 18, '#8a7a5f');
  open.forEach((order, i) => {
    const x = 24 + i * 308;
    const y = 92;
    const recipe = RECIPES[order.recipe];
    ctx.fillStyle = '#fff8e8';
    roundRect(ctx, x, y, 292, 56, 10);
    ctx.fill();
    ctx.fillStyle = recipe.color;
    ctx.fillRect(x, y, 8, 56);
    text(ctx, `#${order.id} ${recipe.name}`, x + 18, y + 16, 17, '#2c1e12');
    recipe.items.forEach((key, j) => {
      const [kind, prep] = key.split(':');
      drawItem(ctx, { kind, prep: prep || 'raw' }, x + 30 + j * 34, y + 40, 24);
    });
    const frac = Math.max(0, order.left / 75);
    ctx.fillStyle = '#e5d9bd';
    ctx.fillRect(x + 18, y + 48, 256, 5);
    ctx.fillStyle = frac > 0.5 ? '#7dc24a' : frac > 0.25 ? '#f6c453' : '#e4572e';
    ctx.fillRect(x + 18, y + 48, 256 * frac, 5);
  });
}

function stationBox(ctx, station, hover) {
  ctx.fillStyle = hover ? '#6b543a' : '#5a4630';
  roundRect(ctx, station.x, station.y, station.w, station.h, 12);
  ctx.fill();
  ctx.fillStyle = '#8a6f4d';
  ctx.fillRect(station.x, station.y, station.w, 10);
  text(ctx, station.label.toUpperCase(), station.x + 14, station.y + 26, 14, '#f3e2c7', 800);
}

function drawStations(ctx, world, hover) {
  for (const station of STATIONS) {
    const isHover = hover && hover.x >= station.x && hover.x <= station.x + station.w
      && hover.y >= station.y && hover.y <= station.y + station.h;
    stationBox(ctx, station, isHover);
  }
  // Ingredient bins.
  const bins = STATIONS[0];
  const bw = bins.w / BIN_ORDER.length;
  BIN_ORDER.forEach((kind, i) => {
    const cx = bins.x + bw * i + bw / 2;
    ctx.fillStyle = '#2c1e12';
    roundRect(ctx, cx - bw / 2 + 6, bins.y + 40, bw - 12, 56, 8);
    ctx.fill();
    drawItem(ctx, { kind, prep: 'raw' }, cx, bins.y + 62, 34);
    text(ctx, INGREDIENTS[kind].name, cx, bins.y + 88, 11, '#f3e2c7', 700, 'center');
  });
  // Chopping board.
  const chop = STATIONS[1];
  ctx.fillStyle = '#c9a86a';
  roundRect(ctx, chop.x + 20, chop.y + 46, 200, 84, 10);
  ctx.fill();
  if (world.chop.item) {
    drawItem(ctx, world.chop.item, chop.x + 120, chop.y + 88, 56);
    const frac = world.chop.chops / 3;
    ctx.fillStyle = '#2c1e12';
    ctx.fillRect(chop.x + 30, chop.y + 138, 180, 8);
    ctx.fillStyle = '#7dc24a';
    ctx.fillRect(chop.x + 30, chop.y + 138, 180 * frac, 8);
    text(ctx, world.chop.chops >= 3 ? 'CHOPPED — take it!' : `CHOP ${world.chop.chops}/3`, chop.x + 120, chop.y + 122, 14, '#2c1e12', 800, 'center');
  } else {
    text(ctx, 'drop lettuce, tomato', chop.x + 120, chop.y + 80, 14, '#7a5c33', 700, 'center');
    text(ctx, 'or pepperoni here', chop.x + 120, chop.y + 100, 14, '#7a5c33', 700, 'center');
  }
  // Grill: two slots.
  const grill = STATIONS[2];
  world.grill.forEach((slot, i) => {
    const cx = grill.x + 70 + i * 140;
    ctx.fillStyle = '#1c1a18';
    roundRect(ctx, cx - 58, grill.y + 46, 116, 84, 10);
    ctx.fill();
    ctx.fillStyle = '#33302c';
    for (let g = 0; g < 4; g += 1) ctx.fillRect(cx - 50 + g * 26, grill.y + 54, 14, 68);
    if (slot.item) {
      const state = slot.t >= 9 ? 'burnt' : slot.t >= 4 ? 'done' : 'cooking';
      drawItem(ctx, { kind: slot.item.kind, prep: state === 'done' ? 'grilled' : state === 'burnt' ? 'burnt' : 'raw' }, cx, grill.y + 88, 52);
      const frac = Math.min(1, slot.t / 4);
      ctx.fillStyle = '#2c1e12';
      ctx.fillRect(cx - 50, grill.y + 138, 100, 8);
      ctx.fillStyle = state === 'burnt' ? '#e4572e' : state === 'done' ? '#7dc24a' : '#f6c453';
      ctx.fillRect(cx - 50, grill.y + 138, 100 * frac, 8);
      if (state === 'done') text(ctx, 'READY!', cx, grill.y + 122, 13, '#7dc24a', 800, 'center');
      if (state === 'burnt') text(ctx, 'BURNT!', cx, grill.y + 122, 13, '#ff5a4e', 800, 'center');
    }
  });
  // Fryer.
  const fryer = STATIONS[3];
  ctx.fillStyle = '#1c1a18';
  roundRect(ctx, fryer.x + 30, fryer.y + 46, 140, 84, 10);
  ctx.fill();
  ctx.fillStyle = '#f6c453';
  ctx.beginPath();
  ctx.moveTo(fryer.x + 40, fryer.y + 60); ctx.lineTo(fryer.x + 160, fryer.y + 60);
  ctx.lineTo(fryer.x + 150, fryer.y + 122); ctx.lineTo(fryer.x + 50, fryer.y + 122);
  ctx.closePath(); ctx.fill();
  if (world.fryer.item) {
    const state = world.fryer.t >= 9 ? 'burnt' : world.fryer.t >= 3 ? 'done' : 'cooking';
    drawItem(ctx, { kind: 'fries', prep: state === 'done' ? 'fried' : state === 'burnt' ? 'burnt' : 'raw' }, fryer.x + 100, fryer.y + 88, 48);
    const frac = Math.min(1, world.fryer.t / 3);
    ctx.fillStyle = '#2c1e12';
    ctx.fillRect(fryer.x + 40, fryer.y + 138, 120, 8);
    ctx.fillStyle = state === 'burnt' ? '#e4572e' : state === 'done' ? '#7dc24a' : '#f6c453';
    ctx.fillRect(fryer.x + 40, fryer.y + 138, 120 * frac, 8);
    if (state === 'done') text(ctx, 'READY!', fryer.x + 100, fryer.y + 122, 13, '#7dc24a', 800, 'center');
    if (state === 'burnt') text(ctx, 'BURNT!', fryer.x + 100, fryer.y + 122, 13, '#ff5a4e', 800, 'center');
  } else {
    text(ctx, 'drop fries', fryer.x + 100, fryer.y + 88, 14, '#8a7a5f', 700, 'center');
  }
  // Plating.
  const plate = STATIONS[4];
  ctx.fillStyle = '#f8f4ea';
  ctx.beginPath(); ctx.ellipse(plate.x + 180, plate.y + 100, 150, 42, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = '#d8cbb2'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.ellipse(plate.x + 180, plate.y + 100, 150, 42, 0, 0, 7); ctx.stroke();
  world.plate.forEach((item, i) => {
    drawItem(ctx, item, plate.x + 80 + i * 50, plate.y + 92, 40);
  });
  if (world.plate.length === 0) text(ctx, 'build the dish here', plate.x + 180, plate.y + 100, 15, '#a08a68', 700, 'center');
  // Serve window.
  const serve = STATIONS[5];
  const match = world.plate.length > 0 && world.orders.some((o) => {
    if (o.state !== 'open') return false;
    const want = RECIPES[o.recipe].items.slice().sort().join('|');
    return world.plate.map(itemKey).sort().join('|') === want;
  });
  ctx.fillStyle = match ? '#7dc24a' : '#8a6f4d';
  roundRect(ctx, serve.x + 20, serve.y + 40, 320, 70, 12);
  ctx.fill();
  text(ctx, match ? '🔔 SERVE IT! Click here' : 'Serve Window', serve.x + 180, serve.y + 76, 20, match ? '#12330a' : '#f3e2c7', 800, 'center');
  // Trash.
  const trash = STATIONS[6];
  ctx.fillStyle = '#3a3a3a';
  roundRect(ctx, trash.x + 20, trash.y + 40, 80, 56, 8);
  ctx.fill();
  text(ctx, '🗑', trash.x + 60, trash.y + 68, 26, '#ccc', 700, 'center');
}

function drawChef(ctx, world) {
  const c = world.chef;
  ctx.save();
  ctx.translate(c.x, c.y);
  // Shadow.
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath(); ctx.ellipse(0, 34, 30, 8, 0, 0, 7); ctx.fill();
  // Body (apron) and head.
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, -22, -6, 44, 40, 12);
  ctx.fill();
  ctx.fillStyle = '#2e7d32';
  ctx.fillRect(-22, 12, 44, 10);
  ctx.fillStyle = '#f2c79b';
  ctx.beginPath(); ctx.arc(0, -20, 18, 0, 7); ctx.fill();
  // Chef hat.
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(-10, -34, 10, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(0, -38, 12, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(10, -34, 10, 0, 7); ctx.fill();
  ctx.fillRect(-16, -36, 32, 8);
  // Face.
  ctx.fillStyle = '#2c1e12';
  ctx.beginPath(); ctx.arc(-6, -20, 2.4, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(6, -20, 2.4, 0, 7); ctx.fill();
  ctx.strokeStyle = '#2c1e12'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(0, -14, 6, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
  // Held item floats above the hat.
  if (c.hand) {
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath(); ctx.arc(0, -62, 22, 0, 7); ctx.fill();
    drawItem(ctx, c.hand, 0, -62, 30);
  }
  ctx.restore();
}

function drawParticles(ctx, world) {
  for (const p of world.particles) {
    ctx.globalAlpha = Math.max(0, 1 - p.t / p.life);
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawFlash(ctx, world) {
  if (!world.servedFlash) return;
  const f = world.servedFlash;
  const a = f.t < 0.3 ? f.t / 0.3 : f.t > f.dur - 0.4 ? (f.dur - f.t) / 0.4 : 1;
  ctx.globalAlpha = Math.max(0, Math.min(1, a));
  ctx.fillStyle = '#12330a';
  roundRect(ctx, 440, 660, 400, 64, 16);
  ctx.fill();
  text(ctx, f.text, 640, 692, 30, '#ffd94a', 800, 'center');
  ctx.globalAlpha = 1;
}

function drawTitle(ctx, world) {
  ctx.fillStyle = 'rgba(20,12,6,0.72)';
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);
  text(ctx, 'SIZZLE & SERVE', 640, 300, 72, '#ffc93c', 800, 'center');
  text(ctx, 'The lunch rush is on. Take orders, chop, grill, plate — and serve before the timer runs out.', 640, 370, 22, '#ffffff', 600, 'center');
  text(ctx, 'CLICK a station: the chef walks over and uses it.  SPACE serves a finished plate.', 640, 410, 20, '#f3e2c7', 600, 'center');
  text(ctx, '▶  CLICK TO START YOUR SHIFT  ◀', 640, 500, 30, '#7dc24a', 800, 'center');
  text(ctx, 'Burger · Pizza · Loaded Fries · Garden Salad — 150 seconds, 3 hearts, no walkouts!', 640, 560, 18, '#c9a86a', 600, 'center');
  void world;
}

function drawGameOver(ctx, world) {
  ctx.fillStyle = 'rgba(20,12,6,0.78)';
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);
  text(ctx, world.over.reason, 640, 300, 40, '#ffc93c', 800, 'center');
  text(ctx, '★'.repeat(world.over.stars) + '☆'.repeat(3 - world.over.stars), 640, 380, 56, '#ffd94a', 800, 'center');
  text(ctx, `Coins earned: $${world.coins}   ·   Dishes served: ${world.stats.served}   ·   Best combo: ×${world.bestCombo}`, 640, 460, 24, '#ffffff', 700, 'center');
  text(ctx, 'Press R or click to cook another shift', 640, 530, 22, '#7dc24a', 700, 'center');
}

export function render(ctx, world, hover) {
  drawFloor(ctx);
  drawHUD(ctx, world);
  drawOrders(ctx, world);
  drawStations(ctx, world, hover);
  drawChef(ctx, world);
  drawParticles(ctx, world);
  drawFlash(ctx, world);
  if (world.screen === 'title') drawTitle(ctx, world);
  if (world.screen === 'over') drawGameOver(ctx, world);
}
