// Integer-cent split engine, ported from StingySplitter's client/src/lib/split.ts.
// Every allocation sums exactly to the amount it divides; leftover pennies are
// handed out deterministically with the largest-remainder method.

export const toCents = (n) => Math.round((Number.isFinite(n) ? n : 0) * 100)

/**
 * Split an integer-cents `total` across slots by `weights`, returning integer
 * cents that sum EXACTLY to `total`. Floors every share, then gives the remaining
 * pennies to the largest fractional parts (ties broken by index). When every
 * weight is zero it degrades to an even split. Negative totals are symmetric.
 */
export function allocate(total, weights) {
  const n = weights.length
  if (n === 0) return []
  const sum = weights.reduce((a, b) => a + b, 0)
  const w = sum > 0 ? weights : weights.map(() => 1)
  const wSum = sum > 0 ? sum : n

  const raw = w.map((x) => (total * x) / wSum)
  const floors = raw.map((x) => Math.floor(x))
  const out = floors.slice()
  let leftover = total - floors.reduce((a, b) => a + b, 0)

  const order = raw
    .map((x, i) => ({ i, frac: x - Math.floor(x) }))
    .sort((a, b) => b.frac - a.frac || a.i - b.i)

  const step = leftover >= 0 ? 1 : -1
  let k = 0
  while (leftover !== 0) {
    out[order[((k % n) + n) % n].i] += step
    leftover -= step
    k++
  }
  return out
}

/**
 * Compute the per-person breakdown for a receipt.
 * items:       [{ id, name, price }]
 * people:      [{ id, name }]
 * assignments: { [itemId]: personId[] }
 * mode:        'proportional' | 'even'  (how tax and tip are shared)
 */
export function computeSplit({ items, people, assignments, tax = 0, tip = 0, mode = 'proportional' }) {
  const index = new Map(people.map((p, i) => [p.id, i]))
  const itemCents = people.map(() => 0)
  let unassignedCents = 0

  for (const item of items) {
    const who = (assignments[item.id] || []).filter((pid) => index.has(pid))
    const cents = toCents(item.price)
    if (who.length === 0) {
      unassignedCents += cents
      continue
    }
    const parts = allocate(cents, who.map(() => 1))
    who.forEach((pid, k) => {
      itemCents[index.get(pid)] += parts[k]
    })
  }

  const weights = mode === 'proportional' ? itemCents.slice() : people.map(() => 1)
  const taxCents = allocate(toCents(tax), weights)
  const tipCents = allocate(toCents(tip), weights)

  const totals = people.map((p, i) => ({
    personId: p.id,
    items: itemCents[i],
    tax: taxCents[i],
    tip: tipCents[i],
    total: itemCents[i] + taxCents[i] + tipCents[i],
  }))

  const assignedTotal = totals.reduce((a, t) => a + t.total, 0)
  return { totals, unassignedCents, grandTotalCents: assignedTotal + unassignedCents }
}

/** Single-payer settlement: everyone else pays the payer their own total. */
export function settleTransfers(split, payerId) {
  return split.totals
    .filter((t) => t.personId !== payerId && t.total > 0)
    .map((t) => ({ from: t.personId, to: payerId, cents: t.total }))
}

export const money = (cents) => `$${(cents / 100).toFixed(2)}`
