import { caf, raf } from './animationFrame';

export type AnimationTimeoutId = {
  id: number,
}

export const cancelAnimationTimeout = (frame: AnimationTimeoutId) => {
  caf(frame.id)
}

export const requestAnimationTimeout = (callback: Function, delay: number): AnimationTimeoutId => {
  const start = Date.now()

  const timeout = () => {
    const now = Date.now()
    console.log(now - start, delay)
    if (now - start >= delay) {
      console.log('!!!', now - start, delay)
      callback()
    } else {
      frame.id = raf(timeout)
    }
  }

  const frame: AnimationTimeoutId = {
    id: raf(timeout),
  }

  return frame
}
