// Sizzle & Serve — input. One job: turn mouse clicks and keys into orders for the
// world. Click a station and the chef walks there and uses it; arrows/WASD steer the
// chef by hand; Space serves a finished plate; R restarts after the shift ends.

import { clickAt, serveMatched } from './world.js';

export function attachInput(canvas, world, hooks) {
  const toGame = (event) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  };

  canvas.addEventListener('click', (event) => {
    const p = toGame(event);
    if (world.screen === 'title') {
      hooks.onStart();
      return;
    }
    if (world.screen === 'over') {
      hooks.onRestart();
      return;
    }
    clickAt(world, p.x, p.y);
    // The sound plays when the chef actually arrives and uses the station;
    // main.js watches world.actionCount for that.
  });

  canvas.addEventListener('mousemove', (event) => {
    const p = toGame(event);
    hooks.onHover(p.x, p.y);
  });

  window.addEventListener('keydown', (event) => {
    if (world.screen === 'title' && (event.key === 'Enter' || event.key === ' ')) {
      hooks.onStart();
      return;
    }
    if (world.screen === 'over' && event.key.toLowerCase() === 'r') {
      hooks.onRestart();
      return;
    }
    if (world.screen !== 'play') return;
    const chef = world.chef;
    const step = 46;
    if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') {
      chef.ty = Math.max(120, chef.y - step);
      chef.tx = chef.x;
      chef.moving = true;
      chef.pending = null;
    } else if (event.key === 'ArrowDown' || event.key.toLowerCase() === 's') {
      chef.ty = Math.min(860, chef.y + step);
      chef.tx = chef.x;
      chef.moving = true;
      chef.pending = null;
    } else if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
      chef.tx = Math.max(30, chef.x - step);
      chef.ty = chef.y;
      chef.moving = true;
      chef.pending = null;
    } else if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
      chef.tx = Math.min(1250, chef.x + step);
      chef.ty = chef.y;
      chef.moving = true;
      chef.pending = null;
    } else if (event.key === ' ') {
      event.preventDefault();
      if (serveMatched(world)) hooks.onAction('serve');
    }
  });
}
