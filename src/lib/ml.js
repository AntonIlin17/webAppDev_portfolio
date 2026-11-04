// Small, dependency-free ML routines that power the notebook demo cells:
// a manual MLP with batch backprop (COMP 258 Assignment 2), PCA by Jacobi
// eigen-decomposition and K-Means with silhouette scoring (COMP 257).

export function makeRng(seed = 42) {
  let s = seed >>> 0
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    return s / 4294967296
  }
}

export function shuffledIndices(n, rng) {
  const idx = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[idx[i], idx[j]] = [idx[j], idx[i]]
  }
  return idx
}

/** Stratified split: `testPerClass` rows of every class go to the test set. */
export function stratifiedSplit(X, y, testPerClass, seed = 42) {
  const rng = makeRng(seed)
  const classes = [...new Set(y)]
  const train = []
  const test = []
  for (const c of classes) {
    const rows = y.map((v, i) => (v === c ? i : -1)).filter((i) => i >= 0)
    const order = shuffledIndices(rows.length, rng).map((k) => rows[k])
    order.forEach((i, k) => (k < testPerClass ? test : train).push(i))
  }
  const pick = (ids) => ({ X: ids.map((i) => X[i]), y: ids.map((i) => y[i]) })
  return { train: pick(train), test: pick(test) }
}

export function fitStandardizer(X) {
  const d = X[0].length
  const mean = new Array(d).fill(0)
  const std = new Array(d).fill(0)
  for (const row of X) row.forEach((v, j) => (mean[j] += v / X.length))
  for (const row of X) row.forEach((v, j) => (std[j] += (v - mean[j]) ** 2 / X.length))
  for (let j = 0; j < d; j++) std[j] = Math.sqrt(std[j]) || 1
  const transform = (rows) => rows.map((row) => row.map((v, j) => (v - mean[j]) / std[j]))
  return { mean, std, transform }
}

const sigmoid = (z) => 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, z))))

/**
 * Port of ManualIrisMLP: inputs -> hidden (sigmoid) -> outputs (sigmoid),
 * half-SSE loss averaged over examples, batch gradient steps ADDED to the
 * weights using (target - output) deltas.
 */
export function createMlp({ inputs = 4, hidden = 5, outputs = 3, seed = 42 } = {}) {
  const rng = makeRng(seed)
  const lim1 = Math.sqrt(6 / (inputs + hidden))
  const lim2 = Math.sqrt(6 / (hidden + outputs))
  const uniform = (lim) => (rng() * 2 - 1) * lim
  return {
    inputs, hidden, outputs,
    W1: Array.from({ length: inputs }, () => Array.from({ length: hidden }, () => uniform(lim1))),
    b1: new Array(hidden).fill(0),
    W2: Array.from({ length: hidden }, () => Array.from({ length: outputs }, () => uniform(lim2))),
    b2: new Array(outputs).fill(0),
    lossHistory: [],
  }
}

export function mlpForward(net, x) {
  const h = net.b1.map((b, j) => {
    let s = b
    for (let i = 0; i < net.inputs; i++) s += x[i] * net.W1[i][j]
    return sigmoid(s)
  })
  const o = net.b2.map((b, k) => {
    let s = b
    for (let j = 0; j < net.hidden; j++) s += h[j] * net.W2[j][k]
    return sigmoid(s)
  })
  return { h, o }
}

export function mlpLoss(net, X, T) {
  let total = 0
  X.forEach((x, n) => {
    const { o } = mlpForward(net, x)
    o.forEach((v, k) => (total += 0.5 * (T[n][k] - v) ** 2))
  })
  return total / X.length
}

/** One batch backprop step; returns the loss before the update. */
export function mlpEpoch(net, X, T, lr) {
  const n = X.length
  const gW1 = net.W1.map((row) => row.map(() => 0))
  const gb1 = new Array(net.hidden).fill(0)
  const gW2 = net.W2.map((row) => row.map(() => 0))
  const gb2 = new Array(net.outputs).fill(0)
  let loss = 0
  X.forEach((x, idx) => {
    const { h, o } = mlpForward(net, x)
    const dOut = o.map((v, k) => {
      loss += 0.5 * (T[idx][k] - v) ** 2
      return (T[idx][k] - v) * v * (1 - v)
    })
    const dHid = h.map((v, j) => {
      let s = 0
      for (let k = 0; k < net.outputs; k++) s += dOut[k] * net.W2[j][k]
      return s * v * (1 - v)
    })
    for (let i = 0; i < net.inputs; i++) for (let j = 0; j < net.hidden; j++) gW1[i][j] += (x[i] * dHid[j]) / n
    for (let j = 0; j < net.hidden; j++) gb1[j] += dHid[j] / n
    for (let j = 0; j < net.hidden; j++) for (let k = 0; k < net.outputs; k++) gW2[j][k] += (h[j] * dOut[k]) / n
    for (let k = 0; k < net.outputs; k++) gb2[k] += dOut[k] / n
  })
  for (let i = 0; i < net.inputs; i++) for (let j = 0; j < net.hidden; j++) net.W1[i][j] += lr * gW1[i][j]
  for (let j = 0; j < net.hidden; j++) net.b1[j] += lr * gb1[j]
  for (let j = 0; j < net.hidden; j++) for (let k = 0; k < net.outputs; k++) net.W2[j][k] += lr * gW2[j][k]
  for (let k = 0; k < net.outputs; k++) net.b2[k] += lr * gb2[k]
  loss /= n
  net.lossHistory.push(loss)
  return loss
}

export function mlpPredict(net, x) {
  const { o } = mlpForward(net, x)
  let best = 0
  o.forEach((v, k) => {
    if (v > o[best]) best = k
  })
  return best
}

export const oneHot = (y, k) => y.map((c) => Array.from({ length: k }, (_, i) => (i === c ? 1 : 0)))

export function accuracy(net, X, y) {
  let correct = 0
  X.forEach((x, i) => {
    if (mlpPredict(net, x) === y[i]) correct++
  })
  return correct / X.length
}

export function confusionMatrix(net, X, y, k) {
  const m = Array.from({ length: k }, () => new Array(k).fill(0))
  X.forEach((x, i) => m[y[i]][mlpPredict(net, x)]++)
  return m
}

/** Jacobi eigen-decomposition of a symmetric matrix. Returns eigenpairs sorted by value, descending. */
export function symmetricEigen(A, sweeps = 60) {
  const n = A.length
  const a = A.map((row) => row.slice())
  const V = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)))
  for (let s = 0; s < sweeps; s++) {
    let off = 0
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += a[i][j] ** 2
    if (off < 1e-18) break
    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(a[p][q]) < 1e-14) continue
        const theta = (a[q][q] - a[p][p]) / (2 * a[p][q])
        const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1))
        const c = 1 / Math.sqrt(t * t + 1)
        const sn = t * c
        for (let k = 0; k < n; k++) {
          const akp = a[k][p]
          const akq = a[k][q]
          a[k][p] = c * akp - sn * akq
          a[k][q] = sn * akp + c * akq
        }
        for (let k = 0; k < n; k++) {
          const apk = a[p][k]
          const aqk = a[q][k]
          a[p][k] = c * apk - sn * aqk
          a[q][k] = sn * apk + c * aqk
        }
        for (let k = 0; k < n; k++) {
          const vkp = V[k][p]
          const vkq = V[k][q]
          V[k][p] = c * vkp - sn * vkq
          V[k][q] = sn * vkp + c * vkq
        }
      }
    }
  }
  return a
    .map((row, i) => ({ value: row[i], vector: V.map((r) => r[i]) }))
    .sort((x, y) => y.value - x.value)
}

/** PCA on already-standardized rows. */
export function pca(X, components = 2) {
  const d = X[0].length
  const n = X.length
  const mean = new Array(d).fill(0)
  for (const row of X) row.forEach((v, j) => (mean[j] += v / n))
  const cov = Array.from({ length: d }, () => new Array(d).fill(0))
  for (const row of X) {
    for (let i = 0; i < d; i++) for (let j = 0; j < d; j++) cov[i][j] += ((row[i] - mean[i]) * (row[j] - mean[j])) / (n - 1)
  }
  const eig = symmetricEigen(cov)
  const total = eig.reduce((s, e) => s + e.value, 0)
  const comps = eig.slice(0, components)
  // Fix sign so the largest-magnitude loading is positive (deterministic orientation).
  for (const c of comps) {
    const big = c.vector.reduce((m, v) => (Math.abs(v) > Math.abs(m) ? v : m), 0)
    if (big < 0) c.vector = c.vector.map((v) => -v)
  }
  const transform = (rows) => rows.map((row) => comps.map((c) => c.vector.reduce((s, w, j) => s + w * (row[j] - mean[j]), 0)))
  return { components: comps.map((c) => c.vector), explainedVarianceRatio: comps.map((c) => c.value / total), transform }
}

const dist2 = (a, b) => a.reduce((s, v, i) => s + (v - b[i]) ** 2, 0)

/** Lloyd's K-Means with k-means++ seeding; keeps a snapshot per iteration. */
export function kmeans(X, k, { seed = 42, maxIter = 50 } = {}) {
  const rng = makeRng(seed)
  const centroids = [X[Math.floor(rng() * X.length)].slice()]
  while (centroids.length < k) {
    const d = X.map((x) => Math.min(...centroids.map((c) => dist2(x, c))))
    const total = d.reduce((a, b) => a + b, 0)
    let r = rng() * total
    let pick = 0
    for (let i = 0; i < d.length; i++) {
      r -= d[i]
      if (r <= 0) {
        pick = i
        break
      }
    }
    centroids.push(X[pick].slice())
  }
  let labels = new Array(X.length).fill(0)
  const history = []
  for (let it = 0; it < maxIter; it++) {
    let inertia = 0
    const next = X.map((x) => {
      let best = 0
      let bd = Infinity
      centroids.forEach((c, j) => {
        const d = dist2(x, c)
        if (d < bd) {
          bd = d
          best = j
        }
      })
      inertia += bd
      return best
    })
    history.push({ centroids: centroids.map((c) => c.slice()), labels: next.slice(), inertia })
    const changed = next.some((l, i) => l !== labels[i])
    labels = next
    if (!changed && it > 0) break
    for (let j = 0; j < k; j++) {
      const members = X.filter((_, i) => labels[i] === j)
      if (members.length) centroids[j] = members[0].map((_, dim) => members.reduce((s, m) => s + m[dim], 0) / members.length)
    }
  }
  return { centroids, labels, history, inertia: history[history.length - 1].inertia }
}

/** Mean silhouette coefficient (Euclidean). */
export function silhouetteScore(X, labels) {
  const n = X.length
  const clusters = [...new Set(labels)]
  if (clusters.length < 2) return 0
  const D = X.map((a) => X.map((b) => Math.sqrt(dist2(a, b))))
  let total = 0
  for (let i = 0; i < n; i++) {
    const own = labels[i]
    const meanTo = (c) => {
      let s = 0
      let m = 0
      for (let j = 0; j < n; j++) {
        if (j !== i && labels[j] === c) {
          s += D[i][j]
          m++
        }
      }
      return m ? s / m : 0
    }
    const a = meanTo(own)
    const b = Math.min(...clusters.filter((c) => c !== own).map(meanTo))
    const ownSize = labels.filter((l) => l === own).length
    total += ownSize > 1 ? (b - a) / Math.max(a, b) : 0
  }
  return total / n
}
