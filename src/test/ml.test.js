import { describe, it, expect } from 'vitest'
import { IRIS_X, IRIS_Y } from '../data/iris.js'
import {
  accuracy, confusionMatrix, createMlp, fitStandardizer, kmeans, mlpEpoch, mlpLoss, oneHot, pca, silhouetteScore,
  stratifiedSplit, symmetricEigen,
} from '../lib/ml.js'

describe('iris data', () => {
  it('has 150 rows of 4 features and 50 per class', () => {
    expect(IRIS_X).toHaveLength(150)
    expect(IRIS_X.every((r) => r.length === 4)).toBe(true)
    expect(IRIS_Y.filter((v) => v === 0)).toHaveLength(50)
    expect(IRIS_Y.filter((v) => v === 2)).toHaveLength(50)
  })
})

describe('preprocessing', () => {
  it('splits stratified and standardizes using training statistics', () => {
    const { train, test } = stratifiedSplit(IRIS_X, IRIS_Y, 10)
    expect(train.X).toHaveLength(120)
    expect(test.X).toHaveLength(30)
    expect(test.y.filter((v) => v === 1)).toHaveLength(10)
    const sc = fitStandardizer(train.X)
    const Z = sc.transform(train.X)
    const mean0 = Z.reduce((s, r) => s + r[0], 0) / Z.length
    expect(Math.abs(mean0)).toBeLessThan(1e-9)
  })
})

describe('manual MLP', () => {
  it('learns Iris to high accuracy with batch backprop', () => {
    const { train, test } = stratifiedSplit(IRIS_X, IRIS_Y, 10)
    const sc = fitStandardizer(train.X)
    const Xtr = sc.transform(train.X)
    const Xte = sc.transform(test.X)
    const T = oneHot(train.y, 3)
    const net = createMlp()
    const first = mlpLoss(net, Xtr, T)
    for (let e = 0; e < 3000; e++) mlpEpoch(net, Xtr, T, 0.5)
    const last = mlpLoss(net, Xtr, T)
    expect(last).toBeLessThan(first / 4)
    expect(accuracy(net, Xtr, train.y)).toBeGreaterThan(0.93)
    expect(accuracy(net, Xte, test.y)).toBeGreaterThan(0.85)
    const cm = confusionMatrix(net, Xte, test.y, 3)
    expect(cm.flat().reduce((a, b) => a + b, 0)).toBe(30)
  })
})

describe('PCA', () => {
  it('diagonalizes a symmetric matrix', () => {
    const eig = symmetricEigen([[2, 1], [1, 2]])
    expect(eig[0].value).toBeCloseTo(3, 6)
    expect(eig[1].value).toBeCloseTo(1, 6)
  })

  it('explains most Iris variance with two components', () => {
    const Z = fitStandardizer(IRIS_X).transform(IRIS_X)
    const p = pca(Z, 2)
    expect(p.explainedVarianceRatio[0]).toBeGreaterThan(0.7)
    expect(p.explainedVarianceRatio[0] + p.explainedVarianceRatio[1]).toBeGreaterThan(0.95)
    expect(p.transform(Z)).toHaveLength(150)
  })
})

describe('K-Means and silhouette', () => {
  it('finds three well-separated clusters on PCA-projected Iris', () => {
    const Z = fitStandardizer(IRIS_X).transform(IRIS_X)
    const P = pca(Z, 2).transform(Z)
    const km = kmeans(P, 3)
    expect(km.history.length).toBeGreaterThan(1)
    expect(km.history[0].inertia).toBeGreaterThanOrEqual(km.inertia)
    const s = silhouetteScore(P, km.labels)
    expect(s).toBeGreaterThan(0.4)
    expect(silhouetteScore(P, kmeans(P, 2).labels)).toBeGreaterThan(s * 0.9)
  })
})
