// Notebook picker plus the Colab-styled notebook itself.
import { useState } from 'react'
import Notebook from './Notebook.jsx'
import { assignment1 } from './cellsAssignment1.jsx'
import { assignment2 } from './cellsAssignment2.jsx'
import { lab2 } from './cellsLab2.jsx'
import { ksi } from './cellsKsi.jsx'
import './notebook.css'

const NOTEBOOKS = [
  { ...assignment1, label: 'COMP 258 · A1', tagline: 'Perceptron & ADALINE' },
  { ...assignment2, label: 'COMP 258 · A2', tagline: 'MLP from scratch' },
  { ...lab2, label: 'COMP 257 · Labs', tagline: 'PCA & K-Means' },
  { ...ksi, label: 'COMP 247 · KSI', tagline: 'Collision EDA' },
]

export default function NotebookDemo() {
  const [active, setActive] = useState(0)
  const notebook = NOTEBOOKS[active]
  return (
    <div className="nb-demo">
      <div className="nb-picker" role="tablist" aria-label="Notebooks">
        {NOTEBOOKS.map((n, i) => (
          <button key={n.id} type="button" role="tab" aria-selected={i === active} className={`nb-tab ${i === active ? 'on' : ''}`} onClick={() => setActive(i)}>
            <b>{n.label}</b><span>{n.tagline}</span>
          </button>
        ))}
      </div>
      <Notebook key={notebook.id} notebook={notebook} />
    </div>
  )
}
