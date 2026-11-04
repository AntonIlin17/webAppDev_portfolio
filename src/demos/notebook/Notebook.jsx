// A Colab-styled notebook whose cells run real JavaScript ports of the
// original Python and render live outputs. Each cell shows a short code
// summary, expands to the verbatim notebook source, and has a Run button.
import { useEffect, useRef, useState } from 'react'
import { tokenize } from './highlight.js'

function Code({ code }) {
  return (
    <pre className="nb-code"><code>{tokenize(code).map((t, i) => (t.type === 'plain' ? t.text : <span key={i} className={`tok-${t.type}`}>{t.text}</span>))}</code></pre>
  )
}

function Cell({ cell, index, state, onRun }) {
  const [expanded, setExpanded] = useState(false)
  const fullLines = cell.full.split('\n').length
  const status = state.status || 'idle'
  const counter = status === 'running' ? '*' : state.count ? String(state.count) : ' '
  return (
    <div className={`nb-cell nb-cell--${status}`}>
      <div className="nb-gutter">
        <button type="button" className="nb-play" onClick={() => onRun(index)} disabled={status === 'running'} aria-label={`Run cell ${index + 1}`}>
          {status === 'running' ? <span className="nb-spinner" /> : <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>}
        </button>
        <span className="nb-counter mono">[{counter}]</span>
      </div>
      <div className="nb-main">
        {cell.heading && <div className="nb-heading">{cell.heading}</div>}
        <Code code={expanded ? cell.full : cell.short} />
        <div className="nb-cell-actions">
          <button type="button" className="nb-link" onClick={() => setExpanded((e) => !e)} aria-expanded={expanded}>
            {expanded ? 'Show summary ▴' : `Show full code (${fullLines} lines) ▾`}
          </button>
          <button type="button" className="nb-run" onClick={() => onRun(index)} disabled={status === 'running'}>
            {status === 'running' ? 'Running…' : 'Run cell'}
          </button>
        </div>
        {state.output && <div className="nb-output">{state.output}</div>}
        {state.error && <div className="nb-output nb-error">{String(state.error)}</div>}
        {status === 'idle' && !state.output && <div className="nb-output nb-output--empty">Output appears here.</div>}
      </div>
    </div>
  )
}

export default function Notebook({ notebook }) {
  const [states, setStates] = useState(() => notebook.cells.map(() => ({})))
  const kernelRef = useRef(null)
  const counterRef = useRef(0)
  const mounted = useRef(true)
  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])
  if (!kernelRef.current) kernelRef.current = {}

  // Reset when the notebook changes.
  useEffect(() => {
    setStates(notebook.cells.map(() => ({})))
    kernelRef.current = {}
    counterRef.current = 0
  }, [notebook])

  const update = (i, patch) =>
    mounted.current && setStates((prev) => prev.map((s, k) => (k === i ? { ...s, ...patch } : s)))

  async function runCell(i) {
    const cell = notebook.cells[i]
    update(i, { status: 'running', error: null })
    try {
      const emit = (output) => update(i, { output })
      const output = await cell.run(kernelRef.current, emit)
      counterRef.current += 1
      update(i, { status: 'done', output, count: counterRef.current })
    } catch (err) {
      update(i, { status: 'error', error: err && err.message ? err.message : err })
    }
  }

  async function runAll() {
    for (let i = 0; i < notebook.cells.length; i++) await runCell(i)
  }

  return (
    <div className="nb">
      <div className="nb-bar">
        <div className="nb-file">
          <b>{notebook.file}</b>
          <span>{notebook.subtitle}</span>
        </div>
        <div className="nb-bar-actions">
          <button type="button" className="nb-run" onClick={runAll} disabled={states.some((s) => s.status === 'running')}>▶▶ Run all</button>
          <a className="nb-link" href={notebook.url} target="_blank" rel="noopener noreferrer">Open in Colab ↗</a>
        </div>
      </div>
      {notebook.note && <div className="nb-note">{notebook.note}</div>}
      {notebook.cells.map((cell, i) => <Cell key={cell.id} cell={cell} index={i} state={states[i] || {}} onRun={runCell} />)}
    </div>
  )
}
