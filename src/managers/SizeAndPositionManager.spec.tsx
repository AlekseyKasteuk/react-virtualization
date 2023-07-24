import SizeAndPositionManager from './SizeAndPositionManager'

describe('SizeAndPositionManager', () => {
  const count = 5
  describe('With static size', () => {
    const size = 10

    it('Finite count', () => {
      const manager = new SizeAndPositionManager(count, size)

      expect(manager.getTotalSize()).toEqual(size * count)

      for (let i = 0; i < count; i++) {
        expect(manager.getOffset(i)).toEqual(i * size)

        expect(manager.getIndex(i * size)).toEqual(i)
        expect(manager.getIndex((i + 1) * size - 1)).toEqual(i)
      }
    })

    it('Infinite count', () => {
      const manager = new SizeAndPositionManager(Infinity, size);

      expect(manager.getTotalSize()).toEqual(0)

      for (let i = 0; i < count; i++) {
        expect(manager.getOffset(i)).toEqual(i * size)

        expect(manager.getIndex(i * size)).toEqual(i)
        expect(manager.getIndex((i + 1) * size - 1)).toEqual(i)

        expect(manager.getTotalSize()).toEqual((i + 2) * size)
      }
    })
  })
  describe('With dynamic size', () => {
    const commonSize = 5
    const size = (index: number) => index % 2 ? commonSize * 2 : commonSize

    it('Finite count', () => {
      const manager = new SizeAndPositionManager(count, size)

      expect(manager.getTotalSize()).toEqual((count + Math.floor(count / 2)) * commonSize)

      for (let i = 0; i < count; i++) {
        let _size = 0
        for (let j = 0; j < i; j++) {
          _size += size(j)
        }
        expect(manager.getOffset(i)).toEqual(_size)

        expect(manager.getIndex(_size)).toEqual(i)
        expect(manager.getIndex(_size + size(i) - 1)).toEqual(i)
      }
    })

    it('Infinite count', () => {
      const manager = new SizeAndPositionManager(Infinity, size)

      expect(manager.getTotalSize()).toEqual(0)

      let pixel = 0
      for (let i = 0; i < count; i++) {
        expect(manager.getOffset(i)).toEqual(pixel)
        
        expect(manager.getIndex(pixel)).toEqual(i)
        expect(manager.getIndex(pixel + size(i) - 1)).toEqual(i)
        
        pixel += size(i)
        expect(manager.getTotalSize()).toEqual(pixel + size(i + 1))
      }
    })
  })
})