import permutations from './permutations'

describe('Permutations', () => {
  it('1 array', () => {
    expect(permutations([1,2])).toEqual([[1],[2]])
    expect(permutations([[1],2])).toEqual([[[1]],[2]])
    expect(permutations([1,[2]])).toEqual([[1],[[2]]])
    expect(permutations([[1],[2]])).toEqual([[[1]],[[2]]])
  })
  it('2 arrays', () => {
    expect(permutations([1,2],[3,4])).toEqual([[1,3],[2,3],[1,4],[2,4]])
    expect(permutations([1],[2,3])).toEqual([[1,2],[1,3]])
    expect(permutations([[1]],[2,3])).toEqual([[[1],2],[[1],3]])
    expect(permutations([1],[[2,3]])).toEqual([[1,[2,3]]])
  })
})