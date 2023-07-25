export default (start: number, end: number): number[] => {
  const diff = end - start;
  const length = Math.abs(diff);
  const result = new Array(length);
  const sign = Math.sign(diff) || 1;
  for (let i: number = 0; i < length; i++) {
    result[i] = start + (i * sign);
  }
  return result;
}