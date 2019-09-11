export const permutations = (arr: any[], ...arrs: any[][]): any[] => {
  if (!arrs.length) {
    return arr.map(item => ([item]))
  }
  return permutations(arrs[0], ...arrs.slice(1)).reduce((acc: any[], permutations: any[][]) => {
    for (let item of arr) {
      const itemArr = [item]
      for (let permutation of permutations) {
        acc.push(itemArr.concat(permutation))
      }
    }
    return acc
  }, [])
}

export const range = (start: number, end: number): number[] => {
  const result = []
  for (let i: number = start; i <= end; i++) {
    result.push(i)
  }
  return result
}
