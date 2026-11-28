import { useEffect, useRef } from 'react'
import { browserCanDraw, loadEngine } from './engine.js'
import { signature, theme } from './theme.js'

const root = '/build-art'

// How the signature is drawn: the 3D letters are cut away, leaving the handwriting in the accent.
const signatureInk = { cut: 0.5, cell: 2, duo: true, split: 0.56, inkA: theme.quiet, inkB: theme.ink, lodBias: -1.5 }

/**
 * A dithered picture.
 *   kind="image"      one of the Dither Cabinet elements, named by `specimen`. It reacts to the pointer.
 *   kind="horizon"    the field of dots behind every page.
 *   kind="signature"  the signature, which writes itself once when it scrolls into view.
 * Before the renderer loads, and wherever WebGL is missing, a plain image stands in.
 */
export default function Artwork({ specimen, kind = 'image', className = '', scale = 1 }) {
  const host = useRef(null)
  const canvas = useRef(null)
  const poster = kind === 'signature' ? signature.poster : specimen && `${root}/${specimen}.webp`

  useEffect(() => {
    if (!browserCanDraw()) return
    const target = canvas.current
    const wrapper = host.current
    let mounted = true
    let view, observer, clip, ready, frame

    loadEngine().then((engine) => {
      if (!mounted) return
      view = new engine.View(target, kind === 'horizon'
        ? { kind, reveal: false, gain: 0.28, maxDpr: 1, fps: 20, clear: false, cell: 4 }
        : { src: poster, scale, interactive: kind === 'image', reveal: kind === 'image', maxDpr: 1.5, fps: 30,
            ...(kind === 'signature' && signatureInk) })
      if (poster) {
        const source = engine.preload(poster)
        const hidePoster = () => { if (mounted && engine.gpu) wrapper.dataset.animated = 'true' }
        if (source.ready) hidePoster()
        else source.waiters.push(hidePoster)
      }
      if (kind !== 'signature' || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !engine.gpu) return

      // The signature rests as a still. While it writes, the view borrows the recording, then hands back.
      const entry = engine.video('portfolio-signature', signature, { poster, still: signature.still, loop: false, autoplay: false })
      clip = entry.video
      function play() {
        if (!mounted) return
        clip.currentTime = Math.max(0, signature.still - 4.6)
        clip.playbackRate = 1.6
        clip.play().then(() => {
          if (!mounted) return
          view.setSrc(entry)
          function finish() {
            if (clip.currentTime < signature.still - 0.05 && !clip.ended) frame = requestAnimationFrame(finish)
            else {
              clip.pause()
              view.setSrc(poster)
            }
          }
          frame = requestAnimationFrame(finish)
        }).catch(() => {})
      }
      observer = new IntersectionObserver(([entryVisibility]) => {
        if (!entryVisibility.isIntersecting) return
        observer.disconnect()
        if (entry.videoReady) play()
        else {
          ready = play
          clip.addEventListener('loadeddata', ready, { once: true })
        }
      }, { threshold: 0.6 })
      observer.observe(target)
    }).catch(() => {})

    return () => {
      mounted = false
      delete wrapper.dataset.animated
      view?.destroy()
      observer?.disconnect()
      if (ready) clip.removeEventListener('loadeddata', ready)
      clip?.pause()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [kind, poster, scale])

  return (
    <span ref={host} className={`build-art build-art--${kind} ${className}`} aria-hidden="true">
      {poster && <img className="build-art-fallback" src={poster} alt="" decoding="async" />}
      <canvas ref={canvas} />
    </span>
  )
}
