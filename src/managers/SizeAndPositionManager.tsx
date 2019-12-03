import IndexCache from '../utils/IndexCache'

import SizeType from "../types/SizeType"

export default class SizeAndPositionManager {
  private _pixelCache?: Map<number, number>
  private _indexCache?: IndexCache
  private _size: SizeType
  private _fullSize: number = 0
  private _count: number
  private _lastCalculatedIndex: number = -1
  private _indexCountToAdd: number

  constructor (count: number, size: SizeType, indexCountToAdd?: number, timesToAddFirstly?: number) 
  constructor (count: number, size: SizeType, indexCountToAdd: number = 1, timesToAddFirstly: number = 0) {
    if (count < 0) {
      throw new Error('"count" param must me > 0')
    }
    if (!isFinite(count) && indexCountToAdd < 1) {
      throw new Error('"indexCountToAdd" param must be >= 1')
    }
    this._count = count;
    this._indexCountToAdd = indexCountToAdd
    this._size = size
    if (typeof size !== 'number') {
      this._pixelCache = new Map()
      this._indexCache = new IndexCache()
    }
    if (isFinite(count)) {
      count && this._recalculateFullSize(count - 1)
    } else if (timesToAddFirstly) {
      this._recalculateFullSize(indexCountToAdd * timesToAddFirstly)
    }
  }

  get count (): number {
    return this._count
  }

  get fullSize () : number {
    return this._fullSize
  }

  private _getIndex (index: number): number {
    if (index < 0 || index >= this.count) {
      console.warn(`Index ${index} is out of bounds`)
      index = Math.max(0, Math.min(index, this.count - 1))
    }
    return index
  }

  private _recalculateFullSize (index: number) {
    if (!isFinite(this.count)) {
      index = Math.floor(index / this._indexCountToAdd + 1) * this._indexCountToAdd
    }
    if (this._lastCalculatedIndex < index) {
      if (typeof this._size === 'number') {
        this._fullSize = (index + 1) * this._size
      } else {
        for (let i: number = this._lastCalculatedIndex + 1; i <= index; i++) {
          this._fullSize += this.getSize(i)
        }
      }
      this._lastCalculatedIndex = index
    }
  }

  getSize (index: number): number {
    index = this._getIndex(index)
    return typeof this._size === 'number' ? this._size : this._size(index)
  }

  private _getPixelByIndex (index: number, sum: number = 0): number {
    if (!this._pixelCache.has(index)) {
      const pixel = index > 0 ? this._getPixelByIndex(index - 1, this.getSize(index - 1)) : 0
      this._pixelCache.set(index, pixel)
    }
    return sum + this._pixelCache.get(index)
  }

  getPixelByIndex (index: number): number {
    index = this._getIndex(index)
    let pixel: number = 0
    if (typeof this._size === 'number') {
      pixel = index * this._size
    } else {
      pixel = this._getPixelByIndex(index)
    }
    this._recalculateFullSize(index)
    return pixel
  }

  getIndexByPixel (pixel: number): number {
    if (pixel < 0 || !this.count || (isFinite(this.count) && pixel > this.fullSize))  {
      console.warn(`Pixel ${pixel} is out of bounds`)
      pixel = Math.max(0, Math.min(pixel, this.fullSize))
    }

    let index: number

    if (typeof this._size === 'number') {
      index = Math.min(Math.floor(pixel / this._size), this.count - 1)
    } else {
      index = this._indexCache.get(pixel)
      if (index === -1) {
        index = Math.max(this._lastCalculatedIndex - 1, 0)
        while (true) {
          const start = this.getPixelByIndex(index)
          const end = start + this.getSize(index)

          if (!this._indexCache.has(start)) {
            this._indexCache.set({ start, end, index })
          }

          if (pixel < start) {
            index--
          } else if (pixel >= end && index !== this.count - 1) {
            index++
          } else {
            break
          }
        }
      }
    }
    this._recalculateFullSize(index)
    return index
  }
}