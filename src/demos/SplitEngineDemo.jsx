// Interactive receipt split: the same integer-cent engine StingySplitter ships.
import { useMemo, useState } from 'react'
import { computeSplit, money, settleTransfers, toCents } from '../lib/split.js'

const RECEIPT = {
  merchant: 'The Hungry Otter',
  address: '221 Riverside Walk · 2026-05-24 · 8:14 PM',
  subtotal: 93,
  tax: 7.91,
  tip: 18.6,
  total: 119.51,
}

const ITEMS = [
  { id: 'pizza', name: 'Margherita Pizza', price: 16 },
  { id: 'fries', name: 'Truffle Fries', price: 9.5 },
  { id: 'salad', name: 'Caesar Salad', price: 11 },
  { id: 'salmon', name: 'Grilled Salmon', price: 24 },
  { id: 'lemonade', name: 'Craft Lemonade ×2', price: 10 },
  { id: 'ipa', name: 'IPA Draft ×2', price: 14 },
  { id: 'tart', name: 'Chocolate Tart', price: 8.5 },
]

const PEOPLE = [
  { id: 'alex', name: 'Alex', color: 'var(--chart-1)' },
  { id: 'sam', name: 'Sam', color: 'var(--chart-2)' },
  { id: 'jordan', name: 'Jordan', color: 'var(--chart-3)' },
]

const INITIAL_ASSIGNMENTS = {
  pizza: ['alex', 'sam'],
  fries: ['alex', 'sam', 'jordan'],
  salad: ['jordan'],
  salmon: ['sam'],
  lemonade: ['jordan'],
  ipa: ['alex'],
  tart: ['alex', 'jordan'],
}

export default function SplitEngineDemo() {
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS)
  const [mode, setMode] = useState('proportional')
  const [payerId, setPayerId] = useState('alex')

  const split = useMemo(
    () => computeSplit({ items: ITEMS, people: PEOPLE, assignments, tax: RECEIPT.tax, tip: RECEIPT.tip, mode }),
    [assignments, mode],
  )
  const transfers = settleTransfers(split, payerId)
  const reconciles = split.grandTotalCents === toCents(RECEIPT.total)
  const maxTotal = Math.max(1, ...split.totals.map((t) => t.total))
  const nameOf = (id) => PEOPLE.find((p) => p.id === id).name

  function toggle(itemId, personId) {
    setAssignments((prev) => {
      const current = prev[itemId] || []
      const next = current.includes(personId) ? current.filter((p) => p !== personId) : [...current, personId]
      return { ...prev, [itemId]: next }
    })
  }

  return (
    <div className="demo">
      <div className="demo-head">
        <span className="demo-title"><span className="demo-dot" />Try the split engine</span>
        <span className="demo-hint">same math as production · tap avatars</span>
      </div>
      <div className="demo-body">
        <div className="receipt">
          <div className="receipt-head">
            <div><b>{RECEIPT.merchant}</b><br /><span className="demo-muted">{RECEIPT.address}</span></div>
            <div className="mono demo-muted receipt-meta">parsed in 4.2 s<br />confidence 0.96</div>
          </div>
          {ITEMS.map((item) => (
            <div className="receipt-line" key={item.id}>
              <span className="receipt-name">{item.name}</span>
              <span className="receipt-price mono">{money(toCents(item.price))}</span>
              <span className="receipt-who">
                {PEOPLE.map((p) => {
                  const on = (assignments[item.id] || []).includes(p.id)
                  return (
                    <button
                      key={p.id}
                      type="button"
                      className={`avatar ${on ? 'on' : ''}`}
                      style={on ? { background: p.color } : undefined}
                      aria-pressed={on}
                      aria-label={`${p.name} ${on ? 'had' : 'did not have'} ${item.name}`}
                      title={p.name}
                      onClick={() => toggle(item.id, p.id)}
                    >
                      {p.name[0]}
                    </button>
                  )
                })}
              </span>
            </div>
          ))}
          <div className="receipt-line receipt-sub">
            <span className="receipt-name demo-muted">Subtotal {money(toCents(RECEIPT.subtotal))} · tax {money(toCents(RECEIPT.tax))} · tip {money(toCents(RECEIPT.tip))}</span>
            <span className="receipt-price mono"><b>{money(toCents(RECEIPT.total))}</b></span>
            <span />
          </div>
        </div>

        <div className="demo-row demo-row--between">
          <div className="seg" role="group" aria-label="How tax and tip are shared">
            <button type="button" className={mode === 'proportional' ? 'on' : ''} onClick={() => setMode('proportional')}>Tax &amp; tip proportional</button>
            <button type="button" className={mode === 'even' ? 'on' : ''} onClick={() => setMode('even')}>Even</button>
          </div>
          <label className="demo-muted demo-small">
            Paid by{' '}
            <select className="demo-select" value={payerId} onChange={(e) => setPayerId(e.target.value)}>
              {PEOPLE.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </label>
        </div>

        <div className="person-totals">
          {split.totals.map((t, i) => (
            <div className="person-total" key={t.personId}>
              <span><i className="swatch" style={{ background: PEOPLE[i].color }} />{PEOPLE[i].name}</span>
              <div className="share-bar" title={`items ${money(t.items)} · tax ${money(t.tax)} · tip ${money(t.tip)}`}>
                <i style={{ width: `${(t.items / maxTotal) * 100}%`, background: PEOPLE[i].color }} />
                <i style={{ width: `${(t.tax / maxTotal) * 100}%`, background: 'var(--chart-4)' }} />
                <i style={{ width: `${(t.tip / maxTotal) * 100}%`, background: 'var(--chart-5)' }} />
              </div>
              <span className="mono share-amount">{money(t.total)}</span>
            </div>
          ))}
        </div>
        <div className="demo-legend">
          <span><i className="swatch" style={{ background: 'var(--text-muted)' }} />items</span>
          <span><i className="swatch" style={{ background: 'var(--chart-4)' }} />tax {money(toCents(RECEIPT.tax))}</span>
          <span><i className="swatch" style={{ background: 'var(--chart-5)' }} />tip {money(toCents(RECEIPT.tip))}</span>
        </div>

        <div className="transfers">
          {transfers.length === 0 && <div>Nobody owes anything yet.</div>}
          {transfers.map((t) => (
            <div key={t.from}>{nameOf(t.from)} owes {nameOf(t.to)} <b className="mono">{money(t.cents)}</b></div>
          ))}
          <div className="demo-small transfers-foot">
            {split.unassignedCents > 0 && <span className="demo-warn">{money(split.unassignedCents)} of items unassigned. </span>}
            <span className={reconciles ? 'demo-ok' : ''}>
              {reconciles ? '✓ every cent accounted for' : `Σ ${money(split.grandTotalCents)} vs receipt ${money(toCents(RECEIPT.total))}`}
            </span>
            {' · '}
            {mode === 'proportional' ? "shared charges weighted by each person's items" : 'shared charges split evenly'}
          </div>
        </div>
      </div>
    </div>
  )
}
