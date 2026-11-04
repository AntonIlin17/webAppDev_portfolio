// Re-creation of COMP 258 Assignment 1: train a perceptron and an ADALINE on
// 7x9 letter patterns in the browser, then corrupt pixels and compare them.
import { useEffect, useMemo, useRef, useState } from 'react'
import { COLS, LETTERS, PATTERNS, ROWS, corrupt, makeRng, randomPositions, robustnessExperiment, trainModels } from '../lib/neuralnets.js'

function LetterGlyph({ vector, label, ok }) {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas && canvas.getContext('2d')
    if (!ctx) return
    const style = getComputedStyle(document.documentElement)
    const on = style.getPropertyValue('--text').trim()
    const off = style.getPropertyValue('--surface-2').trim()
    const missing = style.getPropertyValue('--demo-warn').trim()
    for (let i = 0; i < vector.length; i++) {
      ctx.fillStyle = vector[i] === 1 ? on : vector[i] === 0 ? missing : off
      ctx.fillRect(i % COLS, Math.floor(i / COLS), 1, 1)
    }
  }, [vector])
  return (
    <div className="glyph">
      <canvas ref={ref} width={COLS} height={ROWS} aria-label={`Letter ${label[0]} pattern`} />
      <span className={ok ? 'demo-ok' : 'demo-bad'}>{label}</span>
    </div>
  )
}

export default function PerceptronDemo() {
  const [target, setTarget] = useState('A')
  const [type, setType] = useState('wrong')
  const [noise, setNoise] = useState(10)
  const [trial, setTrial] = useState(0)

  const models = useMemo(() => trainModels(target), [target])
  const table = useMemo(() => robustnessExperiment(models, type), [models, type])
  const positions = useMemo(() => randomPositions(makeRng(100 + trial), noise), [noise, trial])

  const shown = PATTERNS.map((p, k) => ({ p, k })).filter(({ p }) => p.font === 1)
  let pRight = 0
  let aRight = 0
  const glyphs = shown.map(({ p, k }) => {
    const x = corrupt(p.v, positions, type)
    const pOk = models.perceptron.predict(x) === models.T[k]
    const aOk = models.adaline.predict(x) === models.T[k]
    if (pOk) pRight++
    if (aOk) aRight++
    return { key: p.letter, vector: x, ok: pOk && aOk, label: `${p.letter} P${pOk ? '✓' : '✗'} A${aOk ? '✓' : '✗'}` }
  })

  return (
    <div className="demo">
      <div className="demo-head">
        <span className="demo-title"><span className="demo-dot" />Perceptron vs ADALINE, trained in your browser</span>
        <span className="demo-hint">63 inputs · 21 patterns</span>
      </div>
      <div className="demo-body">
        <div className="demo-row controls">
          <label className="ctl">Target letter
            <select className="demo-select" value={target} onChange={(e) => setTarget(e.target.value)}>
              {LETTERS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </label>
          <div className="ctl">Corruption
            <div className="seg" role="group" aria-label="Corruption type">
              <button type="button" className={type === 'wrong' ? 'on' : ''} onClick={() => setType('wrong')}>Wrong pixels</button>
              <button type="button" className={type === 'missing' ? 'on' : ''} onClick={() => setType('missing')}>Missing</button>
            </div>
          </div>
          <label className="ctl">
            <span>Affected pixels <b className="mono">{noise}</b> / 63</span>
            <input type="range" min="0" max="20" step="1" value={noise} onChange={(e) => setNoise(Number(e.target.value))} aria-label="Number of corrupted pixels" />
          </label>
        </div>

        <div className="glyph-row">
          {glyphs.map((g) => <LetterGlyph key={g.key} vector={g.vector} label={g.label} ok={g.ok} />)}
        </div>
        <div className="hud">
          <span>perceptron <b>{models.perceptron.epochs} epochs to converge</b></span>
          <span>ADALINE <b>300 epochs, lr 0.001</b></span>
          <span>this trial <b>P {pRight}/7 · A {aRight}/7</b></span>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setTrial((t) => t + 1)}>New trial</button>
        </div>

        <table className="mini-table">
          <thead>
            <tr><th>Affected pixels</th><th>Perceptron</th><th>ADALINE</th></tr>
          </thead>
          <tbody>
            {table.map((row) => (
              <tr key={row.pixels} className={row.pixels === noise ? 'current' : ''}>
                <td>{row.pixels}</td>
                <td>{row.perceptron.toFixed(2)}%</td>
                <td>{row.adaline.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="demo-small demo-muted">
          Averages over 100 random trials per level, the notebook's protocol. Letters are a simplified 7×9 font with two synthetic variants; the original used three Fausett fonts.
        </p>
      </div>
    </div>
  )
}
