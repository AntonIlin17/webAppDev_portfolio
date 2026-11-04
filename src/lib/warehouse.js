// Warehouse world model for the navigation demo. Geometry comes from
// warehouse.world in AntonIlin17/autonomous-warehouse-robot; the destination
// list and aliases mirror src/warehouse_robot_nav/config/locations.csv.

export const WORLD = { width: 16, height: 15, res: 0.25 }
export const NX = WORLD.width / WORLD.res
export const NY = WORLD.height / WORLD.res

// [cx, cy, w, h, type]
export const BOXES = [
  [0, -7.5, 16, 0.3, 'wall'],
  [0, 7.5, 16, 0.3, 'wall'],
  [-8, 0, 0.3, 15, 'wall'],
  [8, 0, 0.3, 15, 'wall'],
  [-6, 0, 0.6, 13, 'shelf'],
  [-3.5, 0, 0.6, 13, 'shelf'],
  [-1, 0, 0.6, 13, 'shelf'],
  [1.5, 0, 0.6, 13, 'shelf'],
  [5.5, 4, 2.5, 1, 'table'],
  [5.5, 6, 2.5, 1, 'table'],
  [5.5, -5.5, 3.5, 2.5, 'dock'],
  [6.5, 0, 1.5, 1.2, 'charger'],
  [-5, -3, 0.6, 0.6, 'obstacle'],
  [-2.25, -2.5, 0.6, 0.6, 'obstacle'],
  [0.25, 3.5, 0.6, 0.6, 'obstacle'],
]

export const DESTINATIONS = [
  { id: 'loading_area', name: 'Loading Area', x: 3, y: -4, aliases: ['loading area', 'loading dock', 'dock', 'loading zone'] },
  { id: 'aisle_1', name: 'Aisle 1', x: -4.75, y: 0, aliases: ['aisle 1', 'aisle one', 'first aisle'] },
  { id: 'aisle_2', name: 'Aisle 2', x: -2.25, y: 0, aliases: ['aisle 2', 'aisle two', 'second aisle'] },
  { id: 'aisle_3', name: 'Aisle 3', x: 0.25, y: 0, aliases: ['aisle 3', 'aisle three', 'third aisle'] },
  { id: 'packing_station', name: 'Packing Station', x: 4.5, y: 5, aliases: ['packing station', 'packing area', 'packing table', 'packing'] },
  { id: 'charging_station', name: 'Charging Station', x: 5.5, y: 0, aliases: ['charging station', 'charging area', 'charger'] },
  { id: 'home', name: 'Home', x: 0, y: 6, aliases: ['home', 'start', 'starting position', 'base'] },
]

export const HOME = { x: 0, y: 6, yaw: Math.PI }

// Stand-in for the Mistral resolver: intent phrases that the real node sends
// to the model, resolved here with a small rule table so the demo needs no API.
const SEMANTIC_RULES = [
  [/batter|charg|power|juice|dead|low/, 'charging_station'],
  [/truck|ship|deliver|unload|receiv|pallet|dock/, 'loading_area'],
  [/pack|box|wrap|order ready|label/, 'packing_station'],
  [/return|go back|rest|park|spawn|start/, 'home'],
  [/first|\b1\b|\bone\b|west/, 'aisle_1'],
  [/second|\b2\b|\btwo\b|middle/, 'aisle_2'],
  [/third|\b3\b|\bthree\b|right/, 'aisle_3'],
]

export const cellX = (x) => Math.floor((x + WORLD.width / 2) / WORLD.res)
export const cellY = (y) => Math.floor((WORLD.height / 2 - y) / WORLD.res)

/** Rasterize the boxes into an occupancy grid plus a one-cell inflated copy. */
export function buildGrid() {
  const occ = new Uint8Array(NX * NY)
  const inflated = new Uint8Array(NX * NY)
  // A cell is occupied when its centre lies inside a box; sampling the centre
  // (rather than any overlap) keeps the 1.9 m aisles passable after inflation.
  const { width, height, res } = WORLD
  for (const [bx, by, bw, bh] of BOXES) {
    const i0 = Math.ceil((bx - bw / 2 + width / 2) / res - 0.5)
    const i1 = Math.floor((bx + bw / 2 + width / 2) / res - 0.5)
    const j0 = Math.ceil((height / 2 - (by + bh / 2)) / res - 0.5)
    const j1 = Math.floor((height / 2 - (by - bh / 2)) / res - 0.5)
    for (let i = i0; i <= i1; i++) {
      for (let j = j0; j <= j1; j++) {
        if (i >= 0 && j >= 0 && i < NX && j < NY) occ[j * NX + i] = 1
      }
    }
  }
  for (let j = 0; j < NY; j++) {
    for (let i = 0; i < NX; i++) {
      if (occ[j * NX + i]) {
        inflated[j * NX + i] = 1
        continue
      }
      outer: for (let dj = -1; dj <= 1; dj++) {
        for (let di = -1; di <= 1; di++) {
          const a = i + di
          const b = j + dj
          if (a >= 0 && b >= 0 && a < NX && b < NY && occ[b * NX + a]) {
            inflated[j * NX + i] = 1
            break outer
          }
        }
      }
    }
  }
  return { occ, inflated }
}

/** 8-connected A* on the inflated grid. Returns world-coordinate waypoints or null. */
export function planPath(grid, start, goal) {
  const { occ, inflated } = grid
  const si = cellX(start.x)
  const sj = cellY(start.y)
  const gi = cellX(goal.x)
  const gj = cellY(goal.y)
  const G = gj * NX + gi
  if (occ[G]) return null
  // The goal pose may sit inside the inflation band (approach poses hug fixtures).
  const blocked = (n) => (n === G ? occ[n] : inflated[n])

  const g = new Float32Array(NX * NY).fill(Infinity)
  const came = new Int32Array(NX * NY).fill(-1)
  const closed = new Uint8Array(NX * NY)
  const h = (i, j) => Math.hypot(i - gi, j - gj)
  const open = [[h(si, sj), sj * NX + si]]
  g[sj * NX + si] = 0

  while (open.length) {
    let best = 0
    for (let k = 1; k < open.length; k++) if (open[k][0] < open[best][0]) best = k
    const [, c] = open.splice(best, 1)[0]
    if (closed[c]) continue
    closed[c] = 1
    if (c === G) {
      const path = []
      for (let n = c; n !== -1; n = came[n]) path.push(n)
      return path.reverse().map((n) => ({
        x: (n % NX + 0.5) * WORLD.res - WORLD.width / 2,
        y: WORLD.height / 2 - (Math.floor(n / NX) + 0.5) * WORLD.res,
      }))
    }
    const i = c % NX
    const j = Math.floor(c / NX)
    for (let dj = -1; dj <= 1; dj++) {
      for (let di = -1; di <= 1; di++) {
        if (!di && !dj) continue
        const a = i + di
        const b = j + dj
        if (a < 0 || b < 0 || a >= NX || b >= NY) continue
        const n = b * NX + a
        if (blocked(n)) continue
        if (di && dj && (blocked(j * NX + a) || blocked(b * NX + i))) continue
        const ng = g[c] + Math.hypot(di, dj)
        if (ng < g[n]) {
          g[n] = ng
          came[n] = c
          open.push([ng + h(a, b), n])
        }
      }
    }
  }
  return null
}

export function pathLength(path) {
  let len = 0
  for (let k = 1; k < path.length; k++) len += Math.hypot(path[k].x - path[k - 1].x, path[k].y - path[k - 1].y)
  return len
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Longest-alias-first, word-boundary keyword match (port of LocationRegistry.match). */
export function matchKeyword(command) {
  const text = command.toLowerCase()
  const pairs = []
  for (const d of DESTINATIONS) for (const a of d.aliases) pairs.push([a, d])
  pairs.sort((a, b) => b[0].length - a[0].length)
  for (const [alias, dest] of pairs) {
    if (new RegExp(`\\b${escapeRe(alias)}\\b`).test(text)) return dest
  }
  return null
}

/** Semantic stand-in for the Mistral enhancement; still allow-listed. */
export function matchSemantic(command) {
  const text = command.toLowerCase()
  for (const [re, id] of SEMANTIC_RULES) {
    if (re.test(text)) return DESTINATIONS.find((d) => d.id === id) || null
  }
  return null
}

/** Cast a ray through the raw occupancy grid; returns distance to the first hit. */
export function raycast(grid, x, y, angle, maxRange) {
  const step = 0.08
  let d = 0
  while (d < maxRange) {
    d += step
    const px = x + Math.cos(angle) * d
    const py = y + Math.sin(angle) * d
    const i = cellX(px)
    const j = cellY(py)
    if (i < 0 || j < 0 || i >= NX || j >= NY || grid.occ[j * NX + i]) return d
  }
  return maxRange
}
