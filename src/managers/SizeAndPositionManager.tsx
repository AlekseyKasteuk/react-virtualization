import IndexCache from '../utils/IndexCache'

import SizeType from "../types/SizeType"

export default class SizeAndPositionManager {
  private sizeCache: Map<number, number>
  private pixelCache: Map<number, number>
  private indexCache: IndexCache
  private size: SizeType
  private _fullSize: number
  private _count: number

  constructor ({ count, size }: { count: number, size: SizeType }) {
    this._count = count;
    this.size = size
    if (typeof size === 'number') {
      this._fullSize = count * size
    } else {
      this.sizeCache = new Map()
      this.pixelCache = new Map()
      this.indexCache = new IndexCache()
    }
  }

  get count (): number {
    return this._count
  }

  get fullSize () : number {
    if (this._fullSize === undefined) {
      this._fullSize = 0
      for (let i: number = 0; i < this.count; i++) {
        this._fullSize += this.getSize(i)
      }
    }
    return this._fullSize
  }

  private getIndex (index: number): number {
    if (this.count === 0) {
      throw new Error('Can\'t get index')
    }
    if (index < 0) {
      console.warn('Index is less then 0', index)
      return 0
    }
    if (index >= this.count) {
      console.warn('Index is greater or equals count', index)
      return this.count - 1
    }
    return index
  }

  getSize (index: number) {
    index = this.getIndex(index)
    if (typeof this.size === 'number') {
      return this.size
    }
    if (!this.sizeCache.has(index)) {
      this.sizeCache.set(index, this.size(index))
    }
    return this.sizeCache.get(index)
  }

  getPixelByIndex (index: number) {
    index = this.getIndex(index)
    if (typeof this.size === 'number') {
      return index * this.size
    }
    if (!this.pixelCache.has(index)) {
      const pixel = index > 0 ? (this.getPixelByIndex(index - 1) + this.getSize(index - 1)) : 0
      this.pixelCache.set(index, pixel)
    }
    return this.pixelCache.get(index)
  }

  getIndexByPixel (pixel: number) {
    let index: number

    if (pixel > this.fullSize) {
      return this.count - 1
    }
    if (typeof this.size === 'number') {
      index = Math.floor(pixel / this.size)
    } else {
      let { index: cachedIndex } = this.indexCache.get(pixel) || {}
      if (cachedIndex === undefined) {
        cachedIndex = (this.count - 1) * Math.floor(pixel / this.fullSize)
        while (true) {
          const start = this.getPixelByIndex(cachedIndex)
          const end = start + this.getSize(cachedIndex)
          this.indexCache.set({ start, end, index: cachedIndex })
          if (pixel < start) {
            cachedIndex--
          } else if (pixel > end) {
            cachedIndex++
          } else {
            break
          }
        }
      }
      index = cachedIndex
    }
    return this.getIndex(index)
  }
}