import { useEffect, useRef } from 'react'

const INTERACTIVE = 'a, button, summary, label, [role="button"]'
const NATIVE = 'input, textarea, select, video, dialog'

// The ring cursor: a small circle that follows the mouse and grows over anything clickable.
// Only for a real mouse. Form fields, video controls and dialogs keep the system cursor.
export default function Cursor() {
  const ring = useRef(null)

  useEffect(() => {
    if (!window.matchMedia?.('(hover: hover) and (pointer: fine)').matches) return
    const node = ring.current
    const root = document.documentElement
    root.classList.add('build-cursor-on')

    function move(event) {
      if (event.pointerType === 'touch') return
      const target = event.target instanceof Element ? event.target : null
      node.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`
      node.dataset.state = target?.closest(NATIVE) ? 'hidden' : target?.closest(INTERACTIVE) ? 'link' : 'idle'
    }
    function leave() {
      node.dataset.state = 'hidden'
    }

    window.addEventListener('pointermove', move, { passive: true })
    root.addEventListener('pointerleave', leave)
    return () => {
      root.classList.remove('build-cursor-on')
      window.removeEventListener('pointermove', move)
      root.removeEventListener('pointerleave', leave)
    }
  }, [])

  return <i ref={ring} className="build-cursor" data-state="hidden" aria-hidden="true" />
}
