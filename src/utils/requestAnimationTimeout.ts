import { cancelAnimationFrame, requestAnimationFrame } from './animationFrame';

export type AnimationTimeoutId = {
  id: number;
};

export const cancelAnimationTimeout = (frame: AnimationTimeoutId) => {
  cancelAnimationFrame(frame.id)
}

export const requestAnimationTimeout = (callback: () => void, delay: number): AnimationTimeoutId => {
  const start = Date.now()

  const timeout = () => {
    const now = Date.now()
    if (now - start >= delay) {
      callback()
    } else {
      frame.id = requestAnimationFrame(timeout)
    }
  }

  const frame: AnimationTimeoutId = {
    id: requestAnimationFrame(timeout),
  }

  return frame
}
