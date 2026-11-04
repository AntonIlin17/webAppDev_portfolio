import '@testing-library/jest-dom'

// jsdom has no canvas implementation; demos guard on a null context.
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = () => null
}
