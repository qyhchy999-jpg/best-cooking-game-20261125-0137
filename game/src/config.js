// Sizzle & Serve — configuration: canvas, recipes, ingredients, stations, tuning.
// One file, one job: every number the game runs on lives here.

export const VIEW = { width: 1280, height: 900 };

export const SHIFT_SECONDS = 150;
export const MAX_HEARTS = 3;
export const MAX_ORDERS = 4;
export const ORDER_PATIENCE = 75;
export const ORDER_SPAWN_EVERY = 16;

export const CHEF_SPEED = 340; // px per second
export const CHOPS_NEEDED = 3;
export const GRILL_SECONDS = 4;
export const BURN_SECONDS = 9;
export const FRY_SECONDS = 3;

// Ingredient ids. `needs` says what a raw item must go through before it can be plated.
export const INGREDIENTS = {
  bun: { name: 'Bun', color: '#e8b25c', dark: '#b97f2e', needs: 'none', price: 1 },
  patty: { name: 'Patty', color: '#8a5a3b', dark: '#5d3a24', needs: 'grill', price: 2 },
  lettuce: { name: 'Lettuce', color: '#7dc24a', dark: '#4d8a26', needs: 'chop', price: 1 },
  tomato: { name: 'Tomato', color: '#e4572e', dark: '#a52f14', needs: 'chop', price: 1 },
  cheese: { name: 'Cheese', color: '#ffc93c', dark: '#d99a00', needs: 'none', price: 1 },
  dough: { name: 'Dough', color: '#f2e3c6', dark: '#c9a86a', needs: 'grill', price: 2 },
  pepperoni: { name: 'Pepperoni', color: '#c0392b', dark: '#7e2318', needs: 'chop', price: 2 },
  fries: { name: 'Fries', color: '#f6c453', dark: '#c98f1b', needs: 'fry', price: 1 },
};

// Recipes: the dish name, the exact set of prepared items on the plate, base coins.
export const RECIPES = {
  burger: {
    name: 'Classic Burger',
    items: ['bun', 'patty:grilled', 'lettuce:chopped', 'tomato:chopped', 'cheese'],
    coins: 14,
    color: '#e8b25c',
  },
  pizza: {
    name: 'Pepperoni Pizza',
    items: ['dough:grilled', 'tomato:chopped', 'cheese', 'pepperoni:chopped'],
    coins: 16,
    color: '#e4572e',
  },
  fries: {
    name: 'Loaded Fries',
    items: ['fries:fried', 'cheese', 'tomato:chopped'],
    coins: 10,
    color: '#f6c453',
  },
  salad: {
    name: 'Garden Salad',
    items: ['lettuce:chopped', 'tomato:chopped', 'cheese'],
    coins: 8,
    color: '#7dc24a',
  },
};

export const RECIPE_ORDER = ['burger', 'pizza', 'fries', 'salad'];

// Station layout on the 1280x900 floor. Each station: id, label, x, y, w, h.
export const STATIONS = [
  { id: 'bins', label: 'Ingredients', x: 40, y: 150, w: 560, h: 110 },
  { id: 'chop', label: 'Chopping Board', x: 40, y: 300, w: 240, h: 150 },
  { id: 'grill', label: 'Grill', x: 320, y: 300, w: 280, h: 150 },
  { id: 'fryer', label: 'Fryer', x: 640, y: 300, w: 200, h: 150 },
  { id: 'plate', label: 'Plating', x: 880, y: 300, w: 360, h: 150 },
  { id: 'serve', label: 'Serve Window', x: 880, y: 500, w: 360, h: 130 },
  { id: 'trash', label: 'Trash', x: 40, y: 500, w: 120, h: 110 },
];

// The 8 ingredient bins inside the bins station, left to right.
export const BIN_ORDER = ['bun', 'patty', 'lettuce', 'tomato', 'cheese', 'dough', 'pepperoni', 'fries'];
