// Path follower for the warehouse sim: tracks the nearest upcoming waypoint
// (so the robot can never lose its place on the path), steers toward a
// lookahead point, and replans if it makes no progress.
import { planPath } from './warehouse.js'

export const FOLLOWER = {
  maxTurnRate: 3, // rad/s
  cruiseSpeed: 1.2, // m/s
  turnSpeed: 0.3, // m/s while the heading error is large
  lookahead: 3, // waypoints ahead of the nearest one
  goalTolerance: 0.2, // m
  stuckSeconds: 2.5,
}

export function createSim(grid, home) {
  return {
    grid,
    robot: { x: home.x, y: home.y, th: home.yaw },
    path: null,
    goal: null,
    wp: 0,
    status: 'IDLE',
    dist: 0,
    elapsed: 0,
    stuckTimer: 0,
    replans: 0,
  }
}

/** Plan to `dest` from the robot's current pose. Returns the path or null. */
export function setGoal(sim, dest) {
  const path = planPath(sim.grid, sim.robot, dest)
  if (!path) return null
  sim.path = path
  sim.goal = dest
  sim.wp = 0
  sim.status = 'NAVIGATING'
  sim.dist = 0
  sim.elapsed = 0
  sim.stuckTimer = 0
  return path
}

function nearestAhead(path, from, r, window) {
  let best = from
  let bestD = Infinity
  const end = Math.min(path.length - 1, from + window)
  for (let i = from; i <= end; i++) {
    const d = Math.hypot(path[i].x - r.x, path[i].y - r.y)
    if (d < bestD) {
      bestD = d
      best = i
    }
  }
  return best
}

/** Advance the sim by dt seconds. Returns an event string when something notable happens. */
export function stepSim(sim, dt, params = FOLLOWER) {
  if (sim.status !== 'NAVIGATING' || !sim.path) return null
  const r = sim.robot
  const path = sim.path
  sim.elapsed += dt

  // Track the nearest waypoint in a forward window, never moving backwards.
  sim.wp = nearestAhead(path, sim.wp, r, 8)
  const look = Math.min(path.length - 1, sim.wp + params.lookahead)
  const target = path[look]

  const want = Math.atan2(target.y - r.y, target.x - r.x)
  let da = want - r.th
  da = Math.atan2(Math.sin(da), Math.cos(da))
  const maxTurn = params.maxTurnRate * dt
  r.th += Math.max(-maxTurn, Math.min(maxTurn, da))
  r.th = Math.atan2(Math.sin(r.th), Math.cos(r.th))

  const speed = Math.abs(da) > 0.9 ? params.turnSpeed : params.cruiseSpeed
  const move = speed * dt
  const before = { x: r.x, y: r.y }
  r.x += Math.cos(r.th) * move
  r.y += Math.sin(r.th) * move
  sim.dist += move

  const goal = sim.goal
  const toGoal = Math.hypot(goal.x - r.x, goal.y - r.y)
  if (toGoal < params.goalTolerance) {
    sim.status = 'SUCCEEDED'
    r.x = goal.x
    r.y = goal.y
    return 'succeeded'
  }

  // Progress watchdog: if the robot is not getting closer to its lookahead
  // point for a while, replan from where it actually is.
  const progress = Math.hypot(target.x - before.x, target.y - before.y) - Math.hypot(target.x - r.x, target.y - r.y)
  sim.stuckTimer = progress > 0.004 ? 0 : sim.stuckTimer + dt
  if (sim.stuckTimer > params.stuckSeconds) {
    sim.stuckTimer = 0
    sim.replans++
    const fresh = planPath(sim.grid, r, goal)
    if (fresh) {
      sim.path = fresh
      sim.wp = 0
      return 'replanned'
    }
    sim.status = 'ABORTED'
    return 'aborted'
  }
  return null
}
