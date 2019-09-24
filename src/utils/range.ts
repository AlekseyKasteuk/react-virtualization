export default (start: number, end: number): number[] => {
  const result = []
  const sign = Math.sign(end - start) || 1
  for (let i: number = start; sign >= 0 ? i <= end: i >= end; i += sign) {
    result.push(i)
  }
  return result
}