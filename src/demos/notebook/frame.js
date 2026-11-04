// Yield to the browser so a running cell can repaint between steps.
export const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => resolve()))
