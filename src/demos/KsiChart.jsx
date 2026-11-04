// Fatal share of Toronto KSI collisions, by hour or by year, from the COMP 247 notebook.
import { useState } from 'react'
import { KSI_BY_HOUR, KSI_BY_YEAR } from '../data/ksi.js'

const W = 320
const H = 150
const PAD = { l: 30, r: 8, t: 22, b: 22 }
const Y_MIN = 8
const Y_MAX = 25

export default function KsiChart() {
  const [view, setView] = useState('hour')
  const [hover, setHover] = useState(null)
  const data = view === 'hour' ? KSI_BY_HOUR : KSI_BY_YEAR
  const pct = data.collisions.map((n, i) => (data.fatal[i] / n) * 100)
  const xs = (i) => PAD.l + (i / (pct.length - 1)) * (W - PAD.l - PAD.r)
  const ys = (v) => PAD.t + (1 - (v - Y_MIN) / (Y_MAX - Y_MIN)) * (H - PAD.t - PAD.b)
  const line = pct.map((v, i) => `${i ? 'L' : 'M'}${xs(i).toFixed(1)} ${ys(v).toFixed(1)}`).join(' ')
  const area = `${line} L${xs(pct.length - 1).toFixed(1)} ${ys(Y_MIN)} L${xs(0)} ${ys(Y_MIN)} Z`
  const peak = pct.indexOf(Math.max(...pct))
  const xTicks = view === 'hour' ? [0, 6, 12, 18, 23] : [0, 5, 10, 17]

  function onMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const mx = ((e.clientX - rect.left) / rect.width) * W
    const i = Math.max(0, Math.min(pct.length - 1, Math.round(((mx - PAD.l) / (W - PAD.l - PAD.r)) * (pct.length - 1))))
    setHover(i)
  }

  return (
    <div className="chart">
      <div className="chart-head">
        <span>Fatal share of KSI collisions, %</span>
        <div className="seg seg-xs" role="group" aria-label="Chart grouping">
          <button type="button" className={view === 'hour' ? 'on' : ''} onClick={() => { setView('hour'); setHover(null) }}>by hour</button>
          <button type="button" className={view === 'year' ? 'on' : ''} onClick={() => { setView('year'); setHover(null) }}>by year</button>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Fatality percentage ${view === 'hour' ? 'by hour of day' : 'by year'}`} onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
        {[10, 15, 20, 25].map((t) => (
          <g key={t}>
            <line x1={PAD.l} x2={W - PAD.r} y1={ys(t)} y2={ys(t)} stroke="var(--border)" />
            <text x={PAD.l - 4} y={ys(t) + 3} fontSize="8" textAnchor="end" fill="var(--text-muted)">{t}</text>
          </g>
        ))}
        {xTicks.map((i) => (
          <text key={i} x={xs(i)} y={H - 6} fontSize="8" textAnchor="middle" fill="var(--text-muted)">{data.labels[i]}</text>
        ))}
        <path d={area} fill="var(--chart-1)" opacity="0.12" />
        <path d={line} fill="none" stroke="var(--chart-1)" strokeWidth="2" strokeLinejoin="round" />
        {pct.map((v, i) => (
          <circle key={i} cx={xs(i)} cy={ys(v)} r={i === peak || i === hover ? 3.5 : 2} fill={i === peak || i === hover ? 'var(--chart-1)' : 'var(--surface)'} stroke="var(--chart-1)" strokeWidth="1.5" />
        ))}
        {hover !== null && (
          <line x1={xs(hover)} x2={xs(hover)} y1={PAD.t} y2={ys(Y_MIN)} stroke="var(--text-muted)" strokeDasharray="3 3" />
        )}
      </svg>
      {hover !== null && (
        <div className="chart-tip" style={{ left: `${(xs(hover) / W) * 100}%`, top: `${(ys(pct[hover]) / H) * 100}%` }}>
          <b>{data.labels[hover]}</b> · {pct[hover].toFixed(1)}% fatal<br />
          <span className="demo-muted">{data.fatal[hover]} of {data.collisions[hover]} collisions</span>
        </div>
      )}
    </div>
  )
}
