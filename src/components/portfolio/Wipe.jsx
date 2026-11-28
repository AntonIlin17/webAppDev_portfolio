import { useEffect, useRef, useState } from 'react'
import { dissolve, motionAllowed } from './dissolve.js'
import { theme } from './theme.js'

// Covers the screen for a moment after a change of page, then dissolves in dots.
// App gives it a new `key` on each navigation, which restarts it.
export default function Wipe() {
  const canvas = useRef(null)
  const [active, setActive] = useState(motionAllowed)

  useEffect(() => {
    if (!active) return
    return dissolve(canvas.current, theme.ground, 420, () => setActive(false))
  }, [active])

  return active ? <canvas ref={canvas} className="build-wipe" aria-hidden="true" /> : null
}
