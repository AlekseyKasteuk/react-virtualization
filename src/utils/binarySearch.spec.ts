import binarySearch from './binarySearch'

describe('binarySearch', function () {
  describe('2 elements', function () {
    const array = [2, 3];
    const createMetric = (serchedValue: number) => (value: number) => serchedValue - value;
    it('1st is sutable', function () {
      expect(binarySearch(array, createMetric(2))).toEqual(0)
    })
    it('2nd is sutable', function () {
      expect(binarySearch(array, createMetric(3))).toEqual(1)
    })
    it('No items is sutable', function () {
      expect(binarySearch(array, createMetric(4))).toEqual(-1)
    })
  })
})