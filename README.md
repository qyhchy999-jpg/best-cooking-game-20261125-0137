# Sizzle & Serve — a lunch-rush cooking game

![make.fun](https://make.fun/badge/best-cooking-game-20261125-0137.svg)
![rank](https://make.fun/badge/best-cooking-game-20261125-0137/qyhchy999-jpg/best-cooking-game-20261125-0137/rank.svg)
![reward](https://make.fun/badge/best-cooking-game-20261125-0137/qyhchy999-jpg/best-cooking-game-20261125-0137/reward.svg)

[Make the best cooking game](https://make.fun/bounty/best-cooking-game-20261125-0137) — a complete, original cooking game that plays offline in a desktop browser from its own files.

## How to play

The lunch rush is on. Orders land on the board with a patience timer — take them, chop, grill, plate, and serve before the timer runs out.

- **Click a station** and the chef walks over and uses it: pick ingredients from the bins, chop lettuce/tomato/pepperoni on the board, grill patties and dough, fry the fries.
- **Build the dish on the plate**, then click the **Serve Window** (or press Space) when the plate matches an open order.
- Serve fast for a tip, chain serves for a combo. Three walkouts — or the end of the 150-second shift — and the day is over.

Recipes: Classic Burger, Pepperoni Pizza, Loaded Fries, Garden Salad. Watch the grill — a patty left too long burns, and burnt food goes in the trash.

## Play it

```sh
python3 -m http.server 8080 --directory game
# open http://localhost:8080
```

No build step, no network requests, no assets to download: `game/index.html` and its ES modules under `game/src/`, drawn on canvas with synthesized WebAudio sounds.

## Screenshots

`shots.json` names the three scenes; each is a real render of the game's own code at `?shot=start|play|serve` with a fixed seed: the fresh shift, a burger mid-assembly, and a serve with coins flying.

## Layout

- `main.ts` — the hand-in program: copies `game/` and `screenshots/` to `/output` and writes `dossier.json` with the vendored `vendor/makefun-game.ts`.
- `game/index.html` — the page; `game/src/main.js` — the loop; `game/src/world.js` — the kitchen rules; `game/src/render.js` — all drawing; `game/src/input.js` — mouse and keys; `game/src/config.js` — recipes and tuning; `game/src/random.js` — seeded RNG; `game/src/shots.js` — the screenshot scenes; `game/src/audio.js` — synthesized sounds.
- `screenshots/` — 3 real renders of the game running.
- `shots.json` — the shot list.
