// Perceptron and ADALINE on 7x9 bipolar letter patterns: a JavaScript re-creation
// of COMP 258 Assignment 1 (NumPy originals live in the Colab notebook).

const FONT = {
  A: ['..###..', '.#...#.', '#.....#', '#.....#', '#######', '#.....#', '#.....#', '#.....#', '#.....#'],
  B: ['######.', '#.....#', '#.....#', '#.....#', '######.', '#.....#', '#.....#', '#.....#', '######.'],
  C: ['.#####.', '#.....#', '#......', '#......', '#......', '#......', '#......', '#.....#', '.#####.'],
  D: ['#####..', '#....#.', '#.....#', '#.....#', '#.....#', '#.....#', '#.....#', '#....#.', '#####..'],
  E: ['#######', '#......', '#......', '#......', '#####..', '#......', '#......', '#......', '#######'],
  J: ['..#####', '....#..', '....#..', '....#..', '....#..', '....#..', '#...#..', '#...#..', '.###...'],
  K: ['#....#.', '#...#..', '#..#...', '#.#....', '##.....', '#.#....', '#..#...', '#...#..', '#....#.'],
}

export const LETTERS = Object.keys(FONT)
export const COLS = 7
export const ROWS = 9
export const N_INPUTS = COLS * ROWS

const toVector = (rows) => rows.join('').split('').map((c) => (c === '#' ? 1 : -1))
// Synthetic font variants: a bold (right-smeared) and a tall (down-smeared) copy.
const bold = (rows) => rows.map((r) => r.split('').map((c, i) => (c === '#' || (i > 0 && r[i - 1] === '#') ? '#' : '.')).join(''))
const tall = (rows) => rows.map((r, j) => r.split('').map((c, i) => (c === '#' || (j > 0 && rows[j - 1][i] === '#') ? '#' : '.')).join(''))

/** 21 training patterns: 7 letters x 3 fonts. */
export const PATTERNS = LETTERS.flatMap((letter) => [
  { letter, font: 1, v: toVector(FONT[letter]) },
  { letter, font: 2, v: toVector(bold(FONT[letter])) },
  { letter, font: 3, v: toVector(tall(FONT[letter])) },
])

const net = (w, x) => {
  let s = w[0]
  for (let i = 0; i < x.length; i++) s += w[i + 1] * x[i]
  return s
}
const sign = (v) => (v >= 0 ? 1 : -1)

/** Perceptron learning rule: weights change only when a prediction is wrong. */
export function trainPerceptron(X, T, { epochs = 100, learningRate = 1 } = {}) {
  const w = new Float64Array(X[0].length + 1)
  let epochsRun = 0
  const updatesPerEpoch = []
  for (let ep = 1; ep <= epochs; ep++) {
    epochsRun = ep
    let updates = 0
    for (let k = 0; k < X.length; k++) {
      const err = T[k] - sign(net(w, X[k]))
      if (err !== 0) {
        updates++
        w[0] += learningRate * err
        for (let i = 0; i < X[k].length; i++) w[i + 1] += learningRate * err * X[k][i]
      }
    }
    updatesPerEpoch.push(updates)
    if (updates === 0) break
  }
  return { weights: w, epochs: epochsRun, updatesPerEpoch, net: (x) => net(w, x), predict: (x) => sign(net(w, x)) }
}

/** ADALINE delta rule, batch update on the linear output. */
export function trainAdaline(X, T, { epochs = 300, learningRate = 0.001 } = {}) {
  const n = X[0].length
  const w = new Float64Array(n + 1)
  const cost = []
  for (let ep = 0; ep < epochs; ep++) {
    const err = X.map((x, k) => T[k] - net(w, x))
    w[0] += learningRate * err.reduce((a, b) => a + b, 0)
    for (let i = 0; i < n; i++) {
      let s = 0
      for (let k = 0; k < X.length; k++) s += err[k] * X[k][i]
      w[i + 1] += learningRate * s
    }
    cost.push(err.reduce((a, e) => a + e * e, 0) / 2)
  }
  return { weights: w, epochs, cost, net: (x) => net(w, x), predict: (x) => sign(net(w, x)) }
}

/** Train both models to recognize `target` (+1) against every other letter (-1). */
export function trainModels(target) {
  const X = PATTERNS.map((p) => p.v)
  const T = PATTERNS.map((p) => (p.letter === target ? 1 : -1))
  return { X, T, perceptron: trainPerceptron(X, T), adaline: trainAdaline(X, T) }
}

/** Deterministic LCG so the robustness table is reproducible for a given seed. */
export function makeRng(seed = 1) {
  let s = seed >>> 0
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    return s / 4294967296
  }
}

export function randomPositions(rng, count, size = N_INPUTS) {
  const set = new Set()
  while (set.size < count) set.add(Math.floor(rng() * size))
  return [...set]
}

/** 'wrong' flips the pixel sign; 'missing' zeroes it. */
export function corrupt(v, positions, type) {
  const out = v.slice()
  for (const p of positions) out[p] = type === 'wrong' ? -out[p] : 0
  return out
}

const accuracy = (model, X, T, positions, type) => {
  let correct = 0
  for (let k = 0; k < X.length; k++) if (model.predict(corrupt(X[k], positions, type)) === T[k]) correct++
  return correct / X.length
}

/** Average accuracy over `trials` random corruptions for each noise level. */
export function robustnessExperiment(models, type, { levels = [0, 5, 10, 15, 20], trials = 100, seed = 7 } = {}) {
  const rng = makeRng(seed)
  const { X, T, perceptron, adaline } = models
  return levels.map((n) => {
    let p = 0
    let a = 0
    for (let t = 0; t < trials; t++) {
      const positions = randomPositions(rng, n)
      p += accuracy(perceptron, X, T, positions, type)
      a += accuracy(adaline, X, T, positions, type)
    }
    return { pixels: n, perceptron: (p / trials) * 100, adaline: (a / trials) * 100 }
  })
}
