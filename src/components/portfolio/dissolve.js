// The dither wipe: a flat cover that dissolves through an 8 x 8 Bayer pattern,
// sweeping from the top of the screen to the bottom. Used after a change of page
// and at the end of the opening.

const BAYER = (() => {
  const matrix = new Float32Array(64)
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      let n = 0
      for (let bit = 0; bit < 3; bit++) {
        const bx = (x >> bit) & 1
        const by = (y >> bit) & 1
        n |= ((bx ^ by) * 2 + by) << (4 - bit * 2)
      }
      matrix[y * 8 + x] = (n + 0.5) / 64
    }
  }
  return matrix
})()

const CELL = 8 // one dot of the wipe, in CSS pixels

function rgb(hex) {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/**
 * Paints `canvas` fully covered in `color`, then dissolves it away over `ms`.
 * Returns a function that cancels the animation.
 */
export function dissolve(canvas, color, ms, onDone) {
  const width = Math.max(8, Math.ceil(window.innerWidth / CELL))
  const height = Math.max(8, Math.ceil(window.innerHeight / CELL))
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) {
    onDone?.()
    return () => {}
  }
  const image = context.createImageData(width, height)
  const [r, g, b] = rgb(color)
  for (let i = 0; i < width * height; i++) {
    image.data[i * 4] = r
    image.data[i * 4 + 1] = g
    image.data[i * 4 + 2] = b
  }

  function paint(cover) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const threshold = BAYER[(y & 7) * 8 + (x & 7)] * 0.7 + (y / height) * 0.3
        image.data[(y * width + x) * 4 + 3] = threshold < cover * 1.01 ? 255 : 0
      }
    }
    context.putImageData(image, 0, 0)
  }

  let frame = 0
  const start = performance.now()
  paint(1)
  function step(now) {
    const progress = Math.min(1, (now - start) / ms)
    paint(1 - progress)
    if (progress < 1) frame = requestAnimationFrame(step)
    else onDone?.()
  }
  frame = requestAnimationFrame(step)
  return () => cancelAnimationFrame(frame)
}

export function motionAllowed() {
  return typeof window !== 'undefined' && !!window.matchMedia
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
