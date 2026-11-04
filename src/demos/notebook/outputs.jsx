// Output renderers for notebook cells: text streams, pixel grids, charts, tables.
import { useEffect, useRef } from 'react'

export function Stream({ lines }) {
  return <pre className="nb-stream">{Array.isArray(lines) ? lines.join('\n') : lines}</pre>
}

function usePixels(draw, deps) {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas && canvas.getContext('2d')
    if (!ctx) return
    draw(ctx, canvas)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return ref
}

const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim()

/** A 7x9 bipolar pattern drawn as pixels; 0 (missing) shows in the warning colour. */
export function Glyph({ vector, cols = 7, rows = 9, label, tone }) {
  const ref = usePixels((ctx) => {
    const on = cssVar('--text')
    const off = cssVar('--surface-2')
    const missing = cssVar('--demo-warn')
    for (let i = 0; i < vector.length; i++) {
      ctx.fillStyle = vector[i] === 1 ? on : vector[i] === 0 ? missing : off
      ctx.fillRect(i % cols, Math.floor(i / cols), 1, 1)
    }
  }, [vector])
  return (
    <figure className="nb-glyph">
      <canvas ref={ref} width={cols} height={rows} aria-label={label ? `Pattern ${label}` : 'Letter pattern'} />
      {label && <figcaption className={tone || ''}>{label}</figcaption>}
    </figure>
  )
}

export function GlyphRow({ items }) {
  return <div className="nb-glyph-row">{items.map((g, i) => <Glyph key={i} {...g} />)}</div>
}

/** Signed weights as a diverging heatmap (blue negative, red positive). */
export function Heatmap({ values, cols = 7, rows = 9, title, scale = 6 }) {
  const ref = usePixels((ctx) => {
    const max = Math.max(1e-9, ...values.map((v) => Math.abs(v)))
    for (let i = 0; i < values.length; i++) {
      const v = values[i] / max
      const a = Math.min(1, Math.abs(v)) * 0.95 + 0.05
      ctx.fillStyle = v >= 0 ? `rgba(192,57,43,${a})` : `rgba(42,120,214,${a})`
      ctx.fillRect(i % cols, Math.floor(i / cols), 1, 1)
    }
  }, [values])
  return (
    <figure className="nb-heatmap">
      <canvas ref={ref} width={cols} height={rows} style={{ width: cols * scale * 2 }} aria-label={title || 'Weight heatmap'} />
      {title && <figcaption>{title}</figcaption>}
    </figure>
  )
}

const SERIES_COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']

/**
 * Generic line chart. series: [{ name, values, x? }]. x defaults to the index.
 */
export function LineChart({ series, title, xLabel, yLabel, yMin, yMax, width = 420, height = 200, xTicks, marker, markX, logY = false }) {
  const pad = { l: 44, r: 12, t: title ? 26 : 12, b: 36 }
  const allX = series.flatMap((s) => s.x || s.values.map((_, i) => i))
  const allY = series.flatMap((s) => s.values)
  const x0 = Math.min(...allX)
  const x1 = Math.max(...allX)
  const lo = yMin ?? Math.min(...allY)
  const hi = yMax ?? Math.max(...allY)
  const ty = (v) => (logY ? Math.log10(Math.max(v, 1e-9)) : v)
  const ylo = ty(lo)
  const yhi = ty(hi) === ylo ? ylo + 1 : ty(hi)
  const xs = (x) => pad.l + ((x - x0) / Math.max(1e-9, x1 - x0)) * (width - pad.l - pad.r)
  const ys = (v) => pad.t + (1 - (ty(v) - ylo) / (yhi - ylo)) * (height - pad.t - pad.b)
  const ticks = 4
  const yTicks = Array.from({ length: ticks + 1 }, (_, i) => lo + ((hi - lo) * i) / ticks)
  const xt = xTicks || Array.from({ length: 5 }, (_, i) => x0 + ((x1 - x0) * i) / 4)
  const fmt = (v) => (Math.abs(v) >= 100 ? Math.round(v) : Number(v.toPrecision(3)))
  return (
    <svg className="nb-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title || yLabel || 'chart'}>
      {title && <text x={pad.l} y={16} fontSize="11" fontWeight="600" fill="var(--text)">{title}</text>}
      {yTicks.map((t) => (
        <g key={t}>
          <line x1={pad.l} x2={width - pad.r} y1={ys(t)} y2={ys(t)} stroke="var(--border)" />
          <text x={pad.l - 6} y={ys(t) + 3} fontSize="9" textAnchor="end" fill="var(--text-muted)">{fmt(t)}</text>
        </g>
      ))}
      {xt.map((t) => (
        <text key={t} x={xs(t)} y={height - pad.b + 14} fontSize="9" textAnchor="middle" fill="var(--text-muted)">{fmt(t)}</text>
      ))}
      {xLabel && <text x={(pad.l + width - pad.r) / 2} y={height - 4} fontSize="9" textAnchor="middle" fill="var(--text-muted)">{xLabel}</text>}
      {yLabel && <text transform={`translate(10 ${(pad.t + height - pad.b) / 2}) rotate(-90)`} fontSize="9" textAnchor="middle" fill="var(--text-muted)">{yLabel}</text>}
      {markX !== undefined && <line x1={xs(markX)} x2={xs(markX)} y1={pad.t} y2={height - pad.b} stroke="var(--accent)" strokeDasharray="4 3" />}
      {series.map((s, i) => {
        const X = s.x || s.values.map((_, k) => k)
        const d = s.values.map((v, k) => `${k ? 'L' : 'M'}${xs(X[k]).toFixed(1)} ${ys(v).toFixed(1)}`).join(' ')
        const color = s.color || SERIES_COLORS[i % SERIES_COLORS.length]
        return (
          <g key={s.name || i}>
            <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
            {(marker || s.values.length <= 12) && s.values.map((v, k) => <circle key={k} cx={xs(X[k])} cy={ys(v)} r="3" fill={color} />)}
          </g>
        )
      })}
      {series.length > 1 && series.map((s, i) => (
        <g key={`lg${i}`} transform={`translate(${width - pad.r - 90} ${pad.t + 4 + i * 13})`}>
          <rect width="10" height="3" y="3" fill={s.color || SERIES_COLORS[i % SERIES_COLORS.length]} />
          <text x="14" y="8" fontSize="9" fill="var(--text)">{s.name}</text>
        </g>
      ))}
    </svg>
  )
}

export function BarChart({ items, title, width = 420, height = 160, valueLabel }) {
  const pad = { l: 110, r: 60, t: title ? 26 : 10, b: 10 }
  const max = Math.max(...items.map((i) => i.value))
  const bh = (height - pad.t - pad.b) / items.length
  return (
    <svg className="nb-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title || 'bar chart'}>
      {title && <text x={pad.l} y={16} fontSize="11" fontWeight="600" fill="var(--text)">{title}</text>}
      {items.map((it, i) => {
        const w = ((width - pad.l - pad.r) * it.value) / max
        const y = pad.t + i * bh
        return (
          <g key={it.label}>
            <text x={pad.l - 8} y={y + bh / 2 + 3} fontSize="10" textAnchor="end" fill="var(--text)">{it.label}</text>
            <rect x={pad.l} y={y + 4} width={w} height={bh - 8} rx="3" fill={it.color || 'var(--chart-1)'} />
            <text x={pad.l + w + 6} y={y + bh / 2 + 3} fontSize="10" fill="var(--text-muted)">{valueLabel ? valueLabel(it) : it.value}</text>
          </g>
        )
      })}
    </svg>
  )
}

/** 2-D scatter with class colours and optional centroids. points: [{x, y, c}]. */
export function Scatter({ points, classNames, title, xLabel, yLabel, centroids, width = 420, height = 260 }) {
  const pad = { l: 40, r: 12, t: title ? 26 : 12, b: 34 }
  const xsAll = points.map((p) => p.x)
  const ysAll = points.map((p) => p.y)
  const x0 = Math.min(...xsAll) - 0.3
  const x1 = Math.max(...xsAll) + 0.3
  const y0 = Math.min(...ysAll) - 0.3
  const y1 = Math.max(...ysAll) + 0.3
  const xs = (x) => pad.l + ((x - x0) / (x1 - x0)) * (width - pad.l - pad.r)
  const ys = (y) => pad.t + (1 - (y - y0) / (y1 - y0)) * (height - pad.t - pad.b)
  return (
    <svg className="nb-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title || 'scatter plot'}>
      {title && <text x={pad.l} y={16} fontSize="11" fontWeight="600" fill="var(--text)">{title}</text>}
      <rect x={pad.l} y={pad.t} width={width - pad.l - pad.r} height={height - pad.t - pad.b} fill="none" stroke="var(--border)" />
      {points.map((p, i) => (
        <circle key={i} cx={xs(p.x)} cy={ys(p.y)} r="3.2" fill={SERIES_COLORS[p.c % SERIES_COLORS.length]} fillOpacity="0.75" stroke="var(--surface)" strokeWidth="0.6" />
      ))}
      {centroids && centroids.map((c, i) => (
        <g key={`c${i}`} transform={`translate(${xs(c[0])} ${ys(c[1])})`}>
          <circle r="9" fill="var(--surface)" stroke="var(--text)" strokeWidth="2" />
          <circle r="4" fill={SERIES_COLORS[i % SERIES_COLORS.length]} />
        </g>
      ))}
      {xLabel && <text x={(pad.l + width - pad.r) / 2} y={height - 6} fontSize="9" textAnchor="middle" fill="var(--text-muted)">{xLabel}</text>}
      {yLabel && <text transform={`translate(10 ${(pad.t + height - pad.b) / 2}) rotate(-90)`} fontSize="9" textAnchor="middle" fill="var(--text-muted)">{yLabel}</text>}
      {classNames && classNames.map((n, i) => (
        <g key={n} transform={`translate(${pad.l + 6 + i * 92} ${pad.t + 12})`}>
          <circle r="4" fill={SERIES_COLORS[i % SERIES_COLORS.length]} />
          <text x="8" y="3" fontSize="9" fill="var(--text)">{n}</text>
        </g>
      ))}
    </svg>
  )
}

/** Decision regions of a 2-input classifier painted on a canvas, with sample points on top. */
export function DecisionRegions({ predict, xRange, yRange, points, xLabel, yLabel, classNames, width = 420, height = 280, grid = 90 }) {
  const ref = usePixels((ctx, canvas) => {
    const W = canvas.width
    const H = canvas.height
    const cols = ['rgba(42,120,214,', 'rgba(235,104,52,', 'rgba(27,175,122,']
    const cw = W / grid
    const ch = H / grid
    for (let i = 0; i < grid; i++) {
      for (let j = 0; j < grid; j++) {
        const x = xRange[0] + ((i + 0.5) / grid) * (xRange[1] - xRange[0])
        const y = yRange[1] - ((j + 0.5) / grid) * (yRange[1] - yRange[0])
        ctx.fillStyle = cols[predict(x, y) % 3] + '0.28)'
        ctx.fillRect(i * cw, j * ch, cw + 0.5, ch + 0.5)
      }
    }
    for (const p of points) {
      const px = ((p.x - xRange[0]) / (xRange[1] - xRange[0])) * W
      const py = (1 - (p.y - yRange[0]) / (yRange[1] - yRange[0])) * H
      ctx.beginPath()
      ctx.arc(px, py, 4, 0, Math.PI * 2)
      ctx.fillStyle = cols[p.c % 3] + '1)'
      ctx.fill()
      ctx.strokeStyle = p.wrong ? '#000' : '#fff'
      ctx.lineWidth = p.wrong ? 2 : 1
      ctx.stroke()
    }
  }, [predict, points])
  return (
    <figure className="nb-regions">
      <canvas ref={ref} width={width} height={height} aria-label="Decision regions" />
      <figcaption>
        {xLabel} (→) vs {yLabel} (↑) · {classNames.map((n, i) => <span key={n}><i className="swatch" style={{ background: SERIES_COLORS[i] }} />{n} </span>)}· black ring = misclassified test record
      </figcaption>
    </figure>
  )
}

export function DataTable({ columns, rows, caption }) {
  return (
    <div className="nb-tablewrap">
      <table className="nb-table">
        {caption && <caption>{caption}</caption>}
        <thead><tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i}>{r.map((v, j) => <td key={j}>{v}</td>)}</tr>)}</tbody>
      </table>
    </div>
  )
}
