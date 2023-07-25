import { useEffect, useRef } from 'react';

export const usePreviousValues = (...values: any[]): any[] => {
  const ref = useRef(new Array(values.length));

  useEffect(() => {
    ref.current = values;
  });

  return ref.current;
}

export const usePreviousValue = (value: any) => {
  const [previousValue] = usePreviousValues([value]);
  return previousValue;
}