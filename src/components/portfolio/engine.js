import { look, theme } from './theme.js'

let enginePromise

// Loads the dither renderer on first use and gives it the look of the build.
// It is a separate chunk, so pages can paint before it arrives.
export function loadEngine() {
  enginePromise ??= import('./ditherEngine.js').then(({ default: engine }) => {
    engine.init()
    engine.setLook({ clear: true, ...look, inkA: theme.ink, inkB: theme.ink, bg: theme.ground })
    return engine
  })
  return enginePromise
}

export function browserCanDraw() {
  return typeof window !== 'undefined' && !!window.matchMedia
    && !!window.IntersectionObserver && !!window.ResizeObserver
}
