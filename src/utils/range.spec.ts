import range from './range'

describe('Test range util', () => {
  it('From less to greater', () => {
    expect(range(0, 1)).toEqual([0, 1])
    expect(range(1, 2)).toEqual([1, 2])
    expect(range(-1, 0)).toEqual([-1, 0])
    expect(range(-2, -1)).toEqual([-2, -1])
    expect(range(-1, 1)).toEqual([-1, 0, 1])
  })
  it('From greater to less', () => {
    expect(range(1, 0)).toEqual([1, 0])
    expect(range(3, 2)).toEqual([3, 2])
    expect(range(0, -1)).toEqual([0, -1])
    expect(range(-1, -2)).toEqual([-1, -2])
    expect(range(1, -1)).toEqual([1, 0, -1])
  })
  it('One element', () => {
    expect(range(0, 0)).toEqual([0])
    expect(range(1, 1)).toEqual([1])
    expect(range(-1, -1)).toEqual([-1])
  })
})