import { useEffect, useRef } from 'react'

const root = '/build-art'
let enginePromise

function loadEngine() {
  enginePromise ??= import('./ditherEngine.js').then(({ default: engine }) => {
    engine.init()
    engine.setLook({ clear: true, mode: 'dither', cell: 3, inkA: '#ba081a', inkB: '#ba081a', bg: '#262121', pointer: 'disperse', air: 'drift' })
    return engine
  })
  return enginePromise
}

export default function Artwork({ specimen, kind = 'image', className = '', scale = 1 }) {
  const host = useRef(null)
  const canvas = useRef(null)
  const poster = kind === 'signature' ? `${root}/sig/sig-a.webp` : specimen && `${root}/${specimen}.webp`

  useEffect(() => {
    if (!window.matchMedia || !window.IntersectionObserver || !window.ResizeObserver) return
    const target = canvas.current
    const wrapper = host.current
    let mounted = true
    let view, observer, clip, ready, frame

    loadEngine().then((engine) => {
      if (!mounted) return
      view = new engine.View(target, kind === 'horizon'
        ? { kind, reveal: false, gain: 0.28, maxDpr: 1, fps: 20, clear: false, cell: 4 }
        : { src: poster, scale, interactive: kind === 'image', reveal: kind === 'image', maxDpr: 1.5, fps: 30,
            ...(kind === 'signature' && { cut: 0.5, cell: 2, duo: true, inkA: '#b4b2af', inkB: '#ba081a', lodBias: -1.5 }) })
      if (poster) {
        const source = engine.preload(poster)
        const hidePoster = () => { if (mounted && engine.gpu) wrapper.dataset.animated = 'true' }
        if (source.ready) hidePoster()
        else source.waiters.push(hidePoster)
      }
      if (kind !== 'signature' || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !engine.gpu) return

      const entry = engine.video('portfolio-signature', {
        mp4: `${root}/sig/sig-a.mp4`, webm: `${root}/sig/sig-a.webm`,
      }, { poster, still: 8.1, loop: false, autoplay: false })
      clip = entry.video
      function play() {
        if (!mounted) return
        clip.currentTime = 3.5
        clip.playbackRate = 1.6
        clip.play().then(() => {
          if (!mounted) return
          view.setSrc(entry)
          function finish() {
            if (clip.currentTime < 8.04 && !clip.ended) frame = requestAnimationFrame(finish)
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
