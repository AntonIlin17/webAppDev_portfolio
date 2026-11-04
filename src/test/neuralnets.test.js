import { describe, it, expect } from 'vitest'
import { LETTERS, N_INPUTS, PATTERNS, corrupt, makeRng, randomPositions, robustnessExperiment, trainModels } from '../lib/neuralnets.js'

describe('letter patterns', () => {
  it('has 7 letters x 3 fonts of 63 bipolar inputs', () => {
    expect(LETTERS).toHaveLength(7)
    expect(PATTERNS).toHaveLength(21)
    for (const p of PATTERNS) {
      expect(p.v).toHaveLength(N_INPUTS)
      expect(p.v.every((x) => x === 1 || x === -1)).toBe(true)
    }
  })
})

describe('training', () => {
  it('both models classify every clean pattern correctly for every target letter', () => {
    for (const letter of LETTERS) {
      const { X, T, perceptron, adaline } = trainModels(letter)
      X.forEach((x, k) => {
        expect(perceptron.predict(x), `perceptron ${letter}`).toBe(T[k])
        expect(adaline.predict(x), `adaline ${letter}`).toBe(T[k])
      })
      expect(perceptron.epochs).toBeLessThan(100)
    }
  })
})

describe('corruption and robustness', () => {
  it('corrupts exactly the requested pixels', () => {
    const rng = makeRng(3)
    const pos = randomPositions(rng, 5)
    expect(new Set(pos).size).toBe(5)
    const v = PATTERNS[0].v
    const wrong = corrupt(v, pos, 'wrong')
    const missing = corrupt(v, pos, 'missing')
    pos.forEach((p) => {
      expect(wrong[p]).toBe(-v[p])
      expect(missing[p]).toBe(0)
    })
    expect(wrong.filter((x, i) => x !== v[i])).toHaveLength(5)
  })

  it('reports 100% at zero noise and is deterministic for a seed', () => {
    const models = trainModels('A')
    const a = robustnessExperiment(models, 'wrong', { trials: 20, seed: 11 })
    const b = robustnessExperiment(models, 'wrong', { trials: 20, seed: 11 })
    expect(a).toEqual(b)
    expect(a[0]).toEqual({ pixels: 0, perceptron: 100, adaline: 100 })
    expect(a[a.length - 1].perceptron).toBeLessThanOrEqual(100)
  })
})
