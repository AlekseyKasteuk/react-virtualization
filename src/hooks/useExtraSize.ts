import { RefObject, useLayoutEffect, useState } from 'react';

export const useExtraSize = (target: RefObject<HTMLElement>, deps?: any[]) => {
  const [sizes, setSizes] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const element = target.current;
    if (element) {
      const height = element.offsetHeight - element.clientHeight;
      const width = element.offsetWidth - element.clientWidth;
      if (sizes.height !== height || sizes.width !== width) {
        setSizes({ height, width });
      }
    }
  }, deps);

  return sizes;
}