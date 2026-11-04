// Top-down navigation sim of the ROS 2 warehouse: real world geometry, the
// allow-listed destinations, A* planning, pure-pursuit style following and a
// LiDAR sweep, with a command box that mirrors the keyword / Mistral resolvers.
import { useEffect, useRef, useState } from 'react'
import {
  BOXES, DESTINATIONS, HOME, WORLD, buildGrid, matchKeyword, matchSemantic, pathLength, planPath, raycast,
} from '../lib/warehouse.js'
import coverImg from '../assets/warehouse/cover.webp'
import rvizImg from '../assets/warehouse/rviz-route.webp'
import gazeboImg from '../assets/warehouse/gazebo.webp'
import cmdImg from '../assets/warehouse/command-interface.webp'
import demoVideo from '../assets/warehouse/demo.webm'

const CANVAS_W = 640
const CANVAS_H = 600
const SCALE = CANVAS_W / WORLD.width
const X = (x) => (x + WORLD.width / 2) * SCALE
const Y = (y) => (WORLD.height / 2 - y) * SCALE

const MEDIA = [
  { src: coverImg, alt: 'Gazebo warehouse with the green robot between crates', caption: 'Gazebo Harmonic warehouse world' },
  { src: rvizImg, alt: 'RViz map with the planned Nav2 route in green', caption: 'Nav2 route + AMCL localization' },
  { src: gazeboImg, alt: 'Fresh Gazebo verification run', caption: 'ROS 2 Jazzy verification run' },
  { src: cmdImg, alt: 'Terminal log of the Mistral to Nav2 run', caption: 'Mistral → Nav2, end-to-end verified' },
]

const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim()

export default function WarehouseSimDemo({ onOpenImage }) {
  const canvasRef = useRef(null)
  const simRef = useRef(null)
  const [tab, setTab] = useState('sim')
  const [mode, setMode] = useState('keyword')
  const [command, setCommand] = useState('')
  const [log, setLog] = useState([
    { text: 'ros2 launch warehouse_robot_nav navigation.launch.py · map 16 × 15 m · 7 allow-listed destinations' },
    { text: 'AMCL converged at home (0.00, 6.00, yaw π). Pick a destination or type a request.' },
  ])
  const [hud, setHud] = useState({ pose: '0.00, 6.00', goal: '—', path: '—', status: 'IDLE' })
  const [activeId, setActiveId] = useState(null)

  const addLog = (text, kind) => setLog((prev) => [...prev.slice(-50), { text, kind }])

  // Simulation state lives in a ref so the animation loop never re-renders per frame.
  if (!simRef.current) {
    simRef.current = {
      grid: buildGrid(),
      robot: { x: HOME.x, y: HOME.y, th: HOME.yaw },
      path: null,
      goal: null,
      wp: 0,
      status: 'IDLE',
      t0: 0,
      dist: 0,
    }
  }

  function sendGoal(dest) {
    const sim = simRef.current
    const path = planPath(sim.grid, sim.robot, dest)
    if (!path) {
      addLog(`planner: no path to ${dest.id}`, 'bad')
      return
    }
    sim.path = path
    sim.goal = dest
    sim.wp = 0
    sim.status = 'NAVIGATING'
    sim.t0 = performance.now()
    sim.dist = 0
    const len = pathLength(path)
    setActiveId(dest.id)
    setHud((h) => ({ ...h, goal: `${dest.id} (${dest.x.toFixed(2)}, ${dest.y.toFixed(2)})`, path: `${len.toFixed(1)} m`, status: 'NAVIGATING' }))
    addLog(`goal_pose=${dest.x.toFixed(2)},${dest.y.toFixed(2)},0.00000`)
    addLog(`NavigateToPose goal accepted · NavFn path ${len.toFixed(1)} m`, 'accepted')
  }

  function handleSubmit(e) {
    e.preventDefault()
    const cmd = command.trim()
    if (!cmd) return
    addLog(`$ ${mode === 'llm' ? 'mistral_nav' : 'keyword'} "${cmd}"`)
    let dest = matchKeyword(cmd)
    if (mode === 'llm') {
      if (dest) {
        addLog(`keyword match before model call → ${dest.id}`, 'accepted')
      } else {
        dest = matchSemantic(cmd)
        if (dest) addLog(`mistral_destination=${dest.id}  (allow-listed · temp 0 · json mode)`, 'accepted')
        else addLog('mistral: unauthorized destination → falling back to keyword parser', 'warn')
      }
    } else if (dest) {
      addLog(`→ ${dest.id}`)
    }
    if (!dest) {
      addLog(`no destination matched. Allowed: ${DESTINATIONS.map((d) => d.id).join(', ')}`, 'bad')
      return
    }
    setCommand('')
    sendGoal(dest)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined
    const sim = simRef.current
    let raf = 0
    let last = performance.now()
    let lastHud = 0
    let colors = null
    const readColors = () => {
      colors = {
        floor: cssVar('--sim-floor'), grid: cssVar('--sim-grid'), shelf: cssVar('--sim-shelf'), shelfEdge: cssVar('--sim-shelf-edge'),
        robot: cssVar('--sim-robot'), wall: cssVar('--text-muted'), table: cssVar('--chart-4'), dock: cssVar('--chart-2'),
        charger: cssVar('--chart-1'), obstacle: cssVar('--accent'), text: cssVar('--text'), muted: cssVar('--text-muted'),
        surface: cssVar('--surface'), accent: cssVar('--accent'), ok: cssVar('--demo-ok'), font: cssVar('--font-sans'),
      }
    }
    readColors()
    const observer = new MutationObserver(readColors)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    function step(now) {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const r = sim.robot
      if (sim.status === 'NAVIGATING' && sim.path) {
        const look = Math.min(sim.path.length - 1, sim.wp + 3)
        const target = sim.path[look]
        const want = Math.atan2(target.y - r.y, target.x - r.x)
        let da = want - r.th
        da = Math.atan2(Math.sin(da), Math.cos(da))
        r.th += Math.max(-3 * dt, Math.min(3 * dt, da))
        const speed = Math.abs(da) > 0.8 ? 0.25 : 1.2
        const move = speed * dt
        r.x += Math.cos(r.th) * move
        r.y += Math.sin(r.th) * move
        sim.dist += move
        while (sim.wp < sim.path.length - 1 && Math.hypot(sim.path[sim.wp].x - r.x, sim.path[sim.wp].y - r.y) < 0.3) sim.wp++
        const g = sim.goal
        if (Math.hypot(g.x - r.x, g.y - r.y) < 0.2) {
          sim.status = 'SUCCEEDED'
          r.x = g.x
          r.y = g.y
          const secs = ((now - sim.t0) / 1000).toFixed(1)
          addLog(`Goal finished with status: SUCCEEDED (${secs} s, ${sim.dist.toFixed(1)} m)`, 'ok')
          setHud((h) => ({ ...h, status: 'SUCCEEDED' }))
        }
      }
      if (now - lastHud > 120) {
        lastHud = now
        setHud((h) => (h.pose === `${r.x.toFixed(2)}, ${r.y.toFixed(2)}` ? h : { ...h, pose: `${r.x.toFixed(2)}, ${r.y.toFixed(2)}` }))
      }
      draw(now)
      raf = requestAnimationFrame(step)
    }

    function draw(now) {
      const c = colors
      const r = sim.robot
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)
      ctx.fillStyle = c.floor
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
      ctx.strokeStyle = c.grid
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let x = -8; x <= 8; x++) { ctx.moveTo(X(x), 0); ctx.lineTo(X(x), CANVAS_H) }
      for (let y = -7; y <= 7; y++) { ctx.moveTo(0, Y(y)); ctx.lineTo(CANVAS_W, Y(y)) }
      ctx.stroke()

      for (const [bx, by, bw, bh, type] of BOXES) {
        ctx.fillStyle = c[type]
        ctx.globalAlpha = type === 'wall' ? 0.9 : 0.85
        ctx.fillRect(X(bx - bw / 2), Y(by + bh / 2), bw * SCALE, bh * SCALE)
        ctx.globalAlpha = 1
        if (type === 'shelf') {
          ctx.strokeStyle = c.shelfEdge
          ctx.strokeRect(X(bx - bw / 2) + 0.5, Y(by + bh / 2) + 0.5, bw * SCALE - 1, bh * SCALE - 1)
        }
      }
      ctx.fillStyle = c.muted
      ctx.font = `11px ${c.font}`
      ctx.textAlign = 'center'
      ctx.fillText('loading dock', X(5.5), Y(-5.5) + 4)
      ctx.fillText('charger', X(6.5), Y(-0.75) + 8)

      for (const d of DESTINATIONS) {
        const active = sim.goal && sim.goal.id === d.id
        ctx.beginPath()
        ctx.arc(X(d.x), Y(d.y), active ? 7 : 5, 0, Math.PI * 2)
        ctx.fillStyle = active ? c.accent : c.surface
        ctx.fill()
        ctx.strokeStyle = active ? c.accent : c.muted
        ctx.lineWidth = 1.5
        ctx.stroke()
        ctx.fillStyle = c.text
        ctx.font = `${active ? '600 ' : ''}11px ${c.font}`
        ctx.fillText(d.name, X(d.x), Y(d.y) - 10)
      }

      // LiDAR sweep
      ctx.strokeStyle = c.robot
      ctx.globalAlpha = 0.35
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let k = 0; k < 48; k++) {
        const a = r.th + (k / 48) * Math.PI * 2
        const d = raycast(sim.grid, r.x, r.y, a, 5)
        ctx.moveTo(X(r.x), Y(r.y))
        ctx.lineTo(X(r.x + Math.cos(a) * d), Y(r.y + Math.sin(a) * d))
      }
      ctx.stroke()
      ctx.globalAlpha = 1

      if (sim.path) {
        ctx.strokeStyle = c.ok
        ctx.lineWidth = 2.5
        ctx.setLineDash(sim.status === 'SUCCEEDED' ? [] : [6, 5])
        ctx.lineDashOffset = -now / 40
        ctx.beginPath()
        sim.path.forEach((p, k) => (k ? ctx.lineTo(X(p.x), Y(p.y)) : ctx.moveTo(X(p.x), Y(p.y))))
        ctx.stroke()
        ctx.setLineDash([])
      }

      ctx.save()
      ctx.translate(X(r.x), Y(r.y))
      ctx.rotate(-r.th)
      ctx.fillStyle = c.robot
      ctx.shadowColor = c.robot
      ctx.shadowBlur = 10
      ctx.fillRect(-8, -8, 16, 16)
      ctx.shadowBlur = 0
      ctx.fillStyle = '#000'
      ctx.globalAlpha = 0.6
      ctx.beginPath()
      ctx.moveTo(10, 0)
      ctx.lineTo(2, -5)
      ctx.lineTo(2, 5)
      ctx.fill()
      ctx.globalAlpha = 1
      ctx.restore()
      ctx.textAlign = 'left'
    }

    raf = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [tab])

  return (
    <div className="demo">
      <div className="demo-head">
        <span className="demo-title"><span className="demo-dot" />Warehouse navigation sim</span>
        <div className="demo-tabs" role="tablist">
          <button type="button" role="tab" aria-selected={tab === 'sim'} className={tab === 'sim' ? 'on' : ''} onClick={() => setTab('sim')}>Sim</button>
          <button type="button" role="tab" aria-selected={tab === 'media'} className={tab === 'media' ? 'on' : ''} onClick={() => setTab('media')}>Real run</button>
        </div>
      </div>
      <div className="demo-body">
        {tab === 'sim' ? (
          <>
            <canvas ref={canvasRef} className="sim-canvas" width={CANVAS_W} height={CANVAS_H} aria-label="Top-down warehouse map with the robot, its LiDAR sweep and planned path" />
            <div className="hud">
              <span>pose <b>{hud.pose}</b></span>
              <span>goal <b>{hud.goal}</b></span>
              <span>path <b>{hud.path}</b></span>
              <span>status <b>{hud.status}</b></span>
            </div>
            <form className="demo-row" onSubmit={handleSubmit}>
              <input
                className="demo-field"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder='Try "the battery is almost dead" or "go to aisle 2"'
                aria-label="Navigation request"
                autoComplete="off"
              />
              <div className="seg" role="group" aria-label="Resolver">
                <button type="button" className={mode === 'keyword' ? 'on' : ''} onClick={() => setMode('keyword')}>Keyword</button>
                <button type="button" className={mode === 'llm' ? 'on' : ''} onClick={() => setMode('llm')}>Mistral</button>
              </div>
              <button className="btn btn-primary btn-sm" type="submit">Send goal</button>
            </form>
            <div className="dest-grid">
              {DESTINATIONS.map((d) => (
                <button key={d.id} type="button" className={`dest ${activeId === d.id ? 'active' : ''}`} onClick={() => { addLog(`$ menu → ${d.id}`); sendGoal(d) }}>
                  {d.name}
                </button>
              ))}
            </div>
            <div className="demo-log" aria-live="polite">
              {log.map((l, i) => <div key={i} className={l.kind || ''}>{l.text}</div>)}
            </div>
          </>
        ) : (
          <>
            <video className="demo-video" src={demoVideo} controls muted playsInline preload="metadata" aria-label="Short navigation sequence recorded from the simulation" />
            <div className="thumbs">
              {MEDIA.map((m) => (
                <figure key={m.src} onClick={() => onOpenImage && onOpenImage(MEDIA.map((x) => x.src), MEDIA.indexOf(m))}>
                  <img src={m.src} alt={m.alt} loading="lazy" />
                  <figcaption>{m.caption}</figcaption>
                </figure>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
