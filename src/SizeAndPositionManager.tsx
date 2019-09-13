import IndexCache, { TreeNode } from './IndexCache'

import { Size } from './types'

interface SizeAndPositionManagerProps {
  count: number,
  size: Size,
}

export default class SizeAndPositionManager {
  private cellStyleCache: Map<number, React.CSSProperties>
  private sizeCache: Map<number, number>
  private pixelCache: Map<number, number>
  private indexCache: IndexCache
  private size: Size
  private _fullSize: number
  private _count: number

  constructor ({ count, size }: { count: number, size: Size }) {
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
    const _index: number = this.getIndex(index)
    if (typeof this.size === 'number') {
      return this.size
    }
    if (!this.sizeCache.has(_index)) {
      this.sizeCache.set(_index, this.size(_index))
    }
    return this.sizeCache.get(_index)
  }

  getPixelByIndex (index: number) {
    const _index: number = this.getIndex(index)
    if (typeof this.size === 'number') {
      return _index * this.size
    }
    if (!this.pixelCache.has(_index)) {
      const value = _index === 0 ? 0 : this.getPixelByIndex(index - 1)
      this.pixelCache.set(_index, value)
    }
    return this.pixelCache.get(_index)
  }

  getIndexByPixel (pixel: number) {
    let index: number

    if (pixel > this.fullSize) {
      return this.count - 1
    }
    if (typeof this.size === 'number') {
      index = Math.floor(pixel / this.size)
    } else {
      if (!this.indexCache.has(pixel)) {
        const proportion = pixel / this.fullSize
        let index = (this.count - 1) * proportion
        while (true) {
          const start = this.getPixelByIndex(index)
          const end = start + this.getSize(index)
          this.indexCache.set({ start, end, value: index })
          if (pixel < start) {
            index--
          } else if (pixel > end) {
            index++
          } else {
            break
          }
        }
      }
      const { value } = this.indexCache.get(pixel)
      index = value
    }
    return this.getIndex(index)
  }
}