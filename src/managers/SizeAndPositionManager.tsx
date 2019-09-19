import IndexCache from '../utils/IndexCache'

import SizeType from "../types/SizeType"

type SizeAndPositionManagerParams = { count: number, size: SizeType, estimatedFullSize?: number }

export default class SizeAndPositionManager {
  private pixelCache?: Map<number, number>
  private indexCache?: IndexCache
  private size: SizeType
  private _fullSize: number = 0
  private _count: number
  private _lastCalculatedIndex: number

  constructor ({ count, size, estimatedFullSize }: SizeAndPositionManagerParams) {
    if (count < 0) {
      throw new Error('Invalid "count" param: "count" param must me > 0')
    }
    if (!isFinite(count) && estimatedFullSize === undefined) {
      throw new Error('Specify "estimatedFullSize" param to provide infinite scroll')
    }
    this._count = count;
    this.size = size
    if (typeof size === 'number' && isFinite(count)) {
      this._lastCalculatedIndex = count - 1;
      this._fullSize = count * size
    } else {
      this.pixelCache = new Map()
      this.indexCache = new IndexCache()
      if (estimatedFullSize !== undefined) {
        this._lastCalculatedIndex = -1;
        this._fullSize = estimatedFullSize
      } else {
        this._lastCalculatedIndex = count - 1;
      }
    }
  }

  get count (): number {
    return this._count
  }

  get fullSize () : number {
    if (this._fullSize === undefined) {
      if (!isFinite(this.count)) {
        throw new Error('You try to get full size by Infinity')
      }
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

  getSize (index: number): number {
    index = this.getIndex(index)
    return typeof this.size === 'number' ? this.size : this.size(index)
  }

  getPixelByIndex (index: number): number {
    index = this.getIndex(index)
    let pixel: number
    if (typeof this.size === 'number' && isFinite(this.count)) {
      return index * this.size
    } else {
      if (!this.pixelCache.has(index)) {
        pixel = index > 0 ? (this.getPixelByIndex(index - 1) + this.getSize(index - 1)) : 0
        this.pixelCache.set(index, pixel)
      } else {
        pixel = this.pixelCache.get(index)
      }
    }
    if (index > this._lastCalculatedIndex) {
      this._lastCalculatedIndex = index
      const size = pixel + this.getSize(index)
      if (index === this.count - 1 || this.fullSize < size) {
        this._fullSize = size
      }
    }
    return pixel
  }

  getIndexByPixel (pixel: number): number {
    let index: number

    if (pixel >= this.fullSize && isFinite(this.count)) {
      return this.count - 1
    }
    if (typeof this.size === 'number') {
      index = Math.floor(pixel / this.size)
    } else {
      let { index: cachedIndex } = this.indexCache.get(pixel) || {}
      if (cachedIndex === undefined) {
        const count = isFinite(this.count) ? this.count - 1 : Math.max(this._lastCalculatedIndex, 0)
        cachedIndex = count * Math.floor(pixel / Math.max(this.fullSize, pixel))
        while (true) {
          const start = this.getPixelByIndex(cachedIndex)
          const end = start + this.getSize(cachedIndex)

          if (!this.indexCache.has(start)) {
            this.indexCache.set({ start, end, index: cachedIndex })
          }

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