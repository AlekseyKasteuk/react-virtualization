import SizeAndPositionCache from '../utils/SizeAndPositionCache'

import SizeType from "../types/SizeType"
import SizeByIndexFunc from '../types/SizeByIndexFuncType';

export default class SizeAndPositionManager {
  private indexToOffsetMap = new Map<number, number>();
  private offsetToIndexCache: SizeAndPositionCache = new SizeAndPositionCache();
  private _count: number;
  private isStaticSize: boolean;
  private size: number;
  private sizeGetter: SizeByIndexFunc;
  private totalSize: number;

  constructor (count: number, size: SizeType) {
    if (count < 0) {
      throw new Error('"count" param must me >= 0');
    }
    this._count = count;
    if (typeof size === 'number') {
      this.isStaticSize = true;
      this.size = size;
    } else {
      this.isStaticSize = false;
      this.sizeGetter = size;
    }
    if (!isFinite(count)) {
      this.totalSize = Infinity;
    }
  }

  get count (): number {
    return this._count;
  }

  getTotalSize () {
    if (this.totalSize === undefined) {
      this.totalSize = this.getRangeSize(0, this._count - 1);
    }
    return this.totalSize;
  }

  getSize (index: number): number {
    if (this._count === 0) {
      return 0
    }
    if (index >= this._count) {
      return this.getSize(this._count - 1)
    }
    if (index < 0) {
      return this.getSize(0)
    }
    return this.isStaticSize ? this.size : this.sizeGetter(index)
  }

  _setCache (index: number, offset: number) {
    this.indexToOffsetMap.set(index, offset);
    this.offsetToIndexCache.push(offset, offset + this.getSize(index));
  }

  getOffset (index: number): number {
    if (this._count === 0) {
      return 0
    }
    if (index >= this._count) {
      return this.getOffset(this._count - 1);
    }
    if (index < 0) {
      return this.getOffset(0);
    }
    if (this.isStaticSize) {
      return index * this.size
    }
    if (!this.indexToOffsetMap.has(index)) {
      const offset = index === 0 ? 0 : this.getEndOffset(index - 1);
      this._setCache(index, offset)
      return offset;
    }
    return this.indexToOffsetMap.get(index) as number;
  }

  getEndOffset (index: number): number {
    return this.getOffset(index) + this.getSize(index);
  }

  private getCachedIndex (offset: number): number {
    const { _count: count, offsetToIndexCache } = this;
    if (offset >= offsetToIndexCache.lastOffset) {
      if (offsetToIndexCache.lastIndex === count - 1) {
        return offsetToIndexCache.lastIndex
      }
      const index = offsetToIndexCache.lastIndex + 1
      if (offset >= this.getOffset(index) + this.getSize(index)) {
        return this.getCachedIndex(offset)
      }
      return index
    }
    return offsetToIndexCache.get(offset);
  }

  getIndex (offset: number): number {
    const { isStaticSize, size, _count: count } = this;
    if (count === 0) {
      return -1
    }
    if (offset < 0) {
      return this.getIndex(0);
    }
    if (isStaticSize) {
      return Math.min(Math.floor(offset / size), count - 1);
    }
    return this.getCachedIndex(offset);
  }

  getData (index: number) {
    return {
      size: this.getSize(index),
      offset: this.getOffset(index),
    }
  }

   getRangeSize (startIndex: number, endIndex: number): number {
     const startOffset = this.getOffset(startIndex);
     const endOffset = this.getOffset(endIndex);
     const endSize = this.getSize(endIndex);
     return endOffset - startOffset + endSize;
   }
}