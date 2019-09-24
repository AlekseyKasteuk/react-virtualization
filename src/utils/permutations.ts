const permutations = (arr: any[], ...arrs: any[][]): any[] => {
  if (!arrs.length) {
    return arr.map(item => ([item]))
  }
  return permutations(arrs[0], ...arrs.slice(1)).reduce((acc: any[], permutations: any[][]) => {
    for (let item of arr) {
      const itemArr = [item]
      for (let permutation of permutations) {
        acc.push(itemArr.concat(arrs.length === 1 && Array.isArray(permutation) ? [permutation] : permutation))
      }
    }
    return acc
  }, [])
}

export default permutations