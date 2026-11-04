// A sentence whose **marked** words light up: once in a staggered sweep when
// the sentence scrolls into view, and continuously near the pointer, which
// acts like a wand passing over the words.
import { useEffect, useRef, useState } from 'react'

const RADIUS = 140 // px around the pointer that lights a word

function parse(text) {
  const parts = []
  const re = /\*\*(.+?)\*\*/g
  let last = 0
  let m
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ glow: false, text: text.slice(last, m.index) })
    parts.push({ glow: true, text: m[1] })
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push({ glow: false, text: text.slice(last) })
  return parts
}

export default function GlowText({ text, className = '' }) {
  const ref = useRef(null)
  const [lit, setLit] = useState(false)
  const parts = parse(text)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    if (typeof IntersectionObserver === 'undefined') {
      setLit(true)
      return undefined
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLit(true)
          io.disconnect()
        }
      },
      { threshold: 0.6 },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const node = ref.current
    if (!node || typeof window === 'undefined') return undefined
    if (window.matchMedia && window.matchMedia('(hover: none)').matches) return undefined
    const words = () => node.querySelectorAll('.glow-word')
    let raf = 0
    let pointer = null
    const paint = () => {
      raf = 0
      words().forEach((w) => {
        if (!pointer) {
          w.style.setProperty('--wand', '0')
          return
        }
        const r = w.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const d = Math.hypot(pointer.x - cx, pointer.y - cy)
        const v = Math.max(0, 1 - d / RADIUS)
        w.style.setProperty('--wand', v.toFixed(3))
      })
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(paint)
    }
    const onMove = (e) => {
      pointer = { x: e.clientX, y: e.clientY }
      schedule()
    }
    const onLeave = () => {
      pointer = null
      schedule()
    }
    const area = node.closest('.project') || node
    area.addEventListener('pointermove', onMove)
    area.addEventListener('pointerleave', onLeave)
    return () => {
      area.removeEventListener('pointermove', onMove)
      area.removeEventListener('pointerleave', onLeave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  let k = 0
  return (
    <p ref={ref} className={`glow-text ${lit ? 'is-lit' : ''} ${className}`.trim()}>
      {parts.map((p, i) =>
        p.glow ? (
          <strong key={i} className="glow-word" style={{ '--i': k++ }}>{p.text}</strong>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </p>
  )
}
