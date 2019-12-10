type Callback = (timestamp: number) => void
type CancelAnimationFrame = (requestId: number) => void
type RequestAnimationFrame = (callback: Callback) => number

let win
if (typeof window !== 'undefined') {
  win = window
} else if (typeof self !== 'undefined') {
  win = self
} else {
  win = {}
}

const getRAF = (): RequestAnimationFrame => {
  const raf =
    win.requestAnimationFrame ||
    win.webkitRequestAnimationFrame ||
    win.mozRequestAnimationFrame ||
    win.oRequestAnimationFrame ||
    win.msRequestAnimationFrame

  if (raf) {
    return raf.bind(win)
  }
  return function (callback: Callback): number {
    return win.setTimeout(callback, 1000 / 60)
  }
}

const getCAF = (): CancelAnimationFrame => {
  const caf =
    win.cancelAnimationFrame ||
    win.webkitCancelAnimationFrame ||
    win.mozCancelAnimationFrame ||
    win.oCancelAnimationFrame ||
    win.msCancelAnimationFrame
  
  if (caf) {
    return caf.bind(win)
  }

  return function (id: number): void {
    win.clearTimeout(id)
  }
}

export const raf: RequestAnimationFrame = getRAF()
export const caf: CancelAnimationFrame = getCAF()