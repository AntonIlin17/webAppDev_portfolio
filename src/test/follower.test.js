import { describe, it, expect } from 'vitest'
import { DESTINATIONS, HOME, buildGrid } from '../lib/warehouse.js'
import { createSim, setGoal, stepSim } from '../lib/follower.js'

const grid = buildGrid()

function drive(sim, dest, maxSeconds = 90) {
  expect(setGoal(sim, dest), `plan to ${dest.id}`).not.toBeNull()
  let t = 0
  while (sim.status === 'NAVIGATING' && t < maxSeconds) {
    stepSim(sim, 1 / 60)
    t += 1 / 60
  }
  return t
}

describe('path follower', () => {
  it('reaches every destination from home without spinning in place', () => {
    for (const dest of DESTINATIONS) {
      const sim = createSim(grid, HOME)
      const seconds = drive(sim, dest)
      expect(sim.status, `${dest.id} after ${seconds.toFixed(1)}s`).toBe('SUCCEEDED')
      expect(sim.replans, `${dest.id} replans`).toBe(0)
    }
  })

  it('completes a tour that visits every destination in sequence, including reversals', () => {
    const sim = createSim(grid, HOME)
    const order = ['charging_station', 'aisle_1', 'loading_area', 'aisle_3', 'packing_station', 'aisle_2', 'home', 'aisle_2']
    for (const id of order) {
      const dest = DESTINATIONS.find((d) => d.id === id)
      drive(sim, dest)
      expect(sim.status, id).toBe('SUCCEEDED')
    }
  })

  it('handles goals sent while already moving', () => {
    const sim = createSim(grid, HOME)
    setGoal(sim, DESTINATIONS.find((d) => d.id === 'loading_area'))
    for (let i = 0; i < 120; i++) stepSim(sim, 1 / 60)
    expect(sim.status).toBe('NAVIGATING')
    drive(sim, DESTINATIONS.find((d) => d.id === 'aisle_1'))
    expect(sim.status).toBe('SUCCEEDED')
  })

  it('works at irregular frame rates', () => {
    const sim = createSim(grid, HOME)
    setGoal(sim, DESTINATIONS.find((d) => d.id === 'charging_station'))
    let t = 0
    const dts = [0.016, 0.05, 0.033, 0.008, 0.05]
    let k = 0
    while (sim.status === 'NAVIGATING' && t < 90) {
      const dt = dts[k++ % dts.length]
      stepSim(sim, dt)
      t += dt
    }
    expect(sim.status).toBe('SUCCEEDED')
  })
})
