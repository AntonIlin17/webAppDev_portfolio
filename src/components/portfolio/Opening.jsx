import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { browserCanDraw, loadEngine } from './engine.js'
import { signature, theme } from './theme.js'
import { dissolve, motionAllowed } from './dissolve.js'

const PLAYED = 'portfolio-opening-played'

function shouldPlay() {
  if (!browserCanDraw() || !motionAllowed()) return false
  try {
    return !window.sessionStorage.getItem(PLAYED)
  } catch {
    return false
  }
}

/**
 * The opening: the AI mark unfolds into the full name, the signature is written across it,
 * and the page then appears through a dither wipe.
 * It plays once per browser session and can be skipped with a click or a key.
 * It does not play at all for people who ask for reduced motion, or without WebGL.
 */
export default function Opening() {
  const [phase, setPhase] = useState(() => (shouldPlay() ? 'playing' : 'done'))
  const stage = useRef(null)
  const cover = useRef(null)

  useEffect(() => {
    if (phase !== 'playing') return
    try { window.sessionStorage.setItem(PLAYED, '1') } catch { /* private mode: it plays again next time */ }
    let live = true
    let finished = false
    let view, clip, frame, hold

    function finish() {
      if (!live || finished) return
      finished = true
      clip?.pause()
      setPhase('leaving')
    }

    loadEngine().then((engine) => {
      if (!live || finished) return
      if (!engine.gpu) return finish()
      // No poster here: the stage stays empty until the recording can play from its first frame.
      const entry = engine.video('portfolio-opening', signature, { loop: false, autoplay: false })
      clip = entry.video
      view = new engine.View(stage.current, {
        src: entry, scale: 0.92, reveal: false, clear: true, interactive: false,
        duo: true, split: 0.56, lodBias: -1.5, inkA: theme.quiet, inkB: theme.ink,
      })
      const began = performance.now()
      let started = false
      function tick(now) {
        if (!live || finished) return
        if (!started) {
          if (entry.videoReady) {
            started = true
            clip.currentTime = 0
            clip.playbackRate = 3
            clip.play().catch(finish)
          } else if (now - began > 2600) {
            // The recording is slow to arrive: do not keep the visitor waiting for it.
            return finish()
          }
        } else if (clip.currentTime >= signature.still + 0.5 || clip.ended) {
          clip.pause()
          hold = setTimeout(finish, 380)
          return
        }
        frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }).catch(finish)

    const limit = setTimeout(finish, 7000)
    window.addEventListener('pointerdown', finish)
    window.addEventListener('keydown', finish)
    return () => {
      live = false
      clearTimeout(limit)
      clearTimeout(hold)
      cancelAnimationFrame(frame)
      window.removeEventListener('pointerdown', finish)
      window.removeEventListener('keydown', finish)
      clip?.pause()
      view?.destroy()
    }
  }, [phase])

  // Layout effect: the cover must be painted before the solid background is removed.
  useLayoutEffect(() => {
    if (phase !== 'leaving') return
    return dissolve(cover.current, theme.ground, 700, () => setPhase('done'))
  }, [phase])

  if (phase === 'done') return null
  return (
    <div className={`build-opening build-opening--${phase}`} aria-hidden="true">
      <canvas ref={cover} className="build-opening-cover" />
      <canvas ref={stage} className="build-opening-stage" />
    </div>
  )
}
