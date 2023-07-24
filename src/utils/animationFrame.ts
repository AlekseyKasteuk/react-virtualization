type CancelAnimationFrame = (id: number) => void
type RequestAnimationFrame = (callback: () => void) => number

let win
if (typeof window !== 'undefined') {
  win = window
} else if (typeof self !== 'undefined') {
  win = self
} else {
  win = {}
}

let requestAnimationFrame: RequestAnimationFrame;
let cancelAnimationFrame: CancelAnimationFrame;

if (win.requestAnimationFrame && win.cancelAnimationFrame) {
  requestAnimationFrame = win.requestAnimationFrame;
  cancelAnimationFrame = win.cancelAnimationFrame
} else if (win.setTimeout) {
  requestAnimationFrame = (callback) => win.setTimeout(callback, 1000 / 60);
  cancelAnimationFrame = win.clearTimeout
} else {
  throw new Error('Unable to create request animation functions');
}

export { requestAnimationFrame, cancelAnimationFrame }