import { describe, it, expect } from 'vitest'
import { allocate, computeSplit, settleTransfers, toCents } from '../lib/split.js'

describe('allocate', () => {
  it('sums exactly to the total and hands pennies to the largest remainders', () => {
    expect(allocate(100, [1, 1, 1])).toEqual([34, 33, 33])
    expect(allocate(1000, [3, 1])).toEqual([750, 250])
    const out = allocate(1999, [7, 11, 2])
    expect(out.reduce((a, b) => a + b, 0)).toBe(1999)
  })

  it('degrades to an even split when all weights are zero', () => {
    expect(allocate(10, [0, 0, 0, 0])).toEqual([3, 3, 2, 2])
  })

  it('handles negative totals symmetrically', () => {
    const out = allocate(-100, [1, 1, 1])
    expect(out.reduce((a, b) => a + b, 0)).toBe(-100)
    expect(out).toEqual([-33, -33, -34])
  })

  it('returns an empty array for no slots', () => {
    expect(allocate(500, [])).toEqual([])
  })
})

describe('computeSplit', () => {
  const items = [
    { id: 'a', name: 'Pizza', price: 16 },
    { id: 'b', name: 'Fries', price: 9.5 },
    { id: 'c', name: 'Salad', price: 11 },
  ]
  const people = [{ id: 'p1', name: 'Alex' }, { id: 'p2', name: 'Sam' }]

  it('reconciles to the receipt total with proportional shared charges', () => {
    const split = computeSplit({ items, people, assignments: { a: ['p1', 'p2'], b: ['p1'], c: ['p2'] }, tax: 3.65, tip: 7.3, mode: 'proportional' })
    expect(split.grandTotalCents).toBe(toCents(16 + 9.5 + 11 + 3.65 + 7.3))
    expect(split.unassignedCents).toBe(0)
    expect(split.totals[0].items).toBe(800 + 950)
    expect(split.totals[1].items).toBe(800 + 1100)
  })

  it('splits shared charges evenly in even mode', () => {
    const split = computeSplit({ items, people, assignments: { a: ['p1'], b: ['p1'], c: ['p1'] }, tax: 2, tip: 0, mode: 'even' })
    expect(split.totals.map((t) => t.tax)).toEqual([100, 100])
  })

  it('tracks unassigned items separately', () => {
    const split = computeSplit({ items, people, assignments: { a: ['p1'] }, tax: 0, tip: 0 })
    expect(split.unassignedCents).toBe(toCents(9.5 + 11))
    expect(split.grandTotalCents).toBe(toCents(36.5))
  })
})

describe('settleTransfers', () => {
  it('has every non-payer with a balance pay the payer', () => {
    const split = { totals: [{ personId: 'p1', total: 1000 }, { personId: 'p2', total: 0 }, { personId: 'p3', total: 250 }] }
    expect(settleTransfers(split, 'p1')).toEqual([{ from: 'p3', to: 'p1', cents: 250 }])
  })
})
