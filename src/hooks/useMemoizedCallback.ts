import { useCallback, useRef } from 'react';

export const useMemoizedCallback = <T extends (...args: any[]) => any>(callback: T): T => {
  const callbackRef = useRef<T>(callback);
  callbackRef.current = callback
  const memoizedFunctionRef = useCallback((...args) => callbackRef.current(...args), []);
  return memoizedFunctionRef as T;
}