import SizeAndPositionManager from './SizeAndPositionManager'

describe('SizeAndPositionManager', () => {
  const count = 5
  describe('With static size', () => {
    const size = 10

    it('Finite count', () => {
      const manager = new SizeAndPositionManager(count, size)

      expect(manager.fullSize).toEqual(size * count)

      for (let i = 0; i < count; i++) {
        expect(manager.getPixelByIndex(i)).toEqual(i * size)

        expect(manager.getIndexByPixel(i * size)).toEqual(i)
        expect(manager.getIndexByPixel((i + 1) * size - 1)).toEqual(i)
      }
    })

    it('Infinite count', () => {
      const manager = new SizeAndPositionManager(Infinity, size)

      expect(manager.fullSize).toEqual(0)

      for (let i = 0; i < count; i++) {
        expect(manager.getPixelByIndex(i)).toEqual(i * size)

        expect(manager.getIndexByPixel(i * size)).toEqual(i)
        expect(manager.getIndexByPixel((i + 1) * size - 1)).toEqual(i)
      }

      for (let i = 0; i < 5; i++) {
        expect(manager.getPixelByIndex(count + i)).toEqual((count + i) * size)
        expect(manager.getIndexByPixel((count + i) * size)).toEqual(count + i)
        expect(manager.getIndexByPixel((count + i + 1) * size - 1)).toEqual(count + i)

        expect(manager.fullSize).toEqual((count + i + 1) * size)
      }
    })
  })
  describe('With dynamic size', () => {
    const commonSize = 5
    const size = (index: number) => index % 2 ? commonSize * 2 : commonSize

    it('Finite count', () => {
      const manager = new SizeAndPositionManager(count, size)

      expect(manager.fullSize).toEqual((count + Math.floor(count / 2)) * commonSize)

      for (let i = 0; i < count; i++) {
        let _size = 0
        for (let j = 0; j < i; j++) {
          _size += size(j)
        }
        expect(manager.getPixelByIndex(i)).toEqual(_size)

        expect(manager.getIndexByPixel(_size)).toEqual(i)
        expect(manager.getIndexByPixel(_size + size(i) - 1)).toEqual(i)
      }
    })

    it('Infinite count', () => {
      const manager = new SizeAndPositionManager(Infinity, size)

      expect(manager.fullSize).toEqual(0)

      for (let i = 0; i < count; i++) {
        let pixel = 0
        for (let j = 0; j < i; j++) {
          pixel += size(j)
        }
        expect(manager.getPixelByIndex(i)).toEqual(pixel)
        
        expect(manager.getIndexByPixel(pixel)).toEqual(i)
        expect(manager.getIndexByPixel(pixel + size(i) - 1)).toEqual(i)
        
        expect(manager.fullSize).toEqual(pixel + size(i))
      }
    })
  })
})