import { describe, it, expect } from 'vitest'
import { DESTINATIONS, HOME, buildGrid, matchKeyword, matchSemantic, pathLength, planPath, raycast } from '../lib/warehouse.js'

const grid = buildGrid()

describe('warehouse grid and planner', () => {
  it('can plan a path from home to every allow-listed destination', () => {
    for (const dest of DESTINATIONS) {
      const path = planPath(grid, HOME, dest)
      expect(path, dest.id).not.toBeNull()
      const last = path[path.length - 1]
      expect(Math.hypot(last.x - dest.x, last.y - dest.y)).toBeLessThan(0.3)
      if (dest.id !== 'home') expect(pathLength(path)).toBeGreaterThan(0)
    }
  })

  it('never routes through an occupied cell', () => {
    const path = planPath(grid, HOME, DESTINATIONS.find((d) => d.id === 'loading_area'))
    for (const p of path) {
      expect(raycast(grid, p.x, p.y, 0, 0.08)).toBeGreaterThan(0)
    }
  })

  it('refuses a goal inside a shelf', () => {
    expect(planPath(grid, HOME, { x: -6, y: 0 })).toBeNull()
  })
})

describe('destination resolvers', () => {
  it('matches the longest alias on word boundaries', () => {
    expect(matchKeyword('please go to the loading dock now').id).toBe('loading_area')
    expect(matchKeyword('Aisle 2').id).toBe('aisle_2')
    expect(matchKeyword('go home').id).toBe('home')
  })

  it('does not match partial words', () => {
    expect(matchKeyword('the homework is done')).toBeNull()
    expect(matchKeyword('')).toBeNull()
  })

  it('resolves intent phrases to allow-listed destinations only', () => {
    expect(matchSemantic('the battery is almost dead').id).toBe('charging_station')
    expect(matchSemantic('a truck just arrived').id).toBe('loading_area')
    expect(matchSemantic('tell me a joke')).toBeNull()
  })
})
