export default (start: number, end: number): number[] => {
  const result = []
  for (let i: number = start; i <= end; i++) {
    result.push(i)
  }
  return result
}