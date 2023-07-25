import SizeType from "../types/SizeType"
import SizeByIndexFunc from '../types/SizeByIndexFuncType';
import binarySearch, { SEARCH_TYPE } from "../utils/binarySearch";

type OffsetCacheItem = [number, number];

const metricsCreator = (offset: number) => ([start, end]: OffsetCacheItem): number => offset >= start ? offset < end ? 0 : 1 : -1;

export default class SizeAndPositionManager {
  private _count: number;
  private isStaticSize: boolean;
  private isFinite: boolean = true;
  private size: number;
  private sizeGetter: SizeByIndexFunc;
  private totalSize: number;
  private offsetToIndexCache: OffsetCacheItem[] = [];

  constructor (count: number, size: SizeType) {
    if (count < 0) {
      throw new Error('"count" param must me >= 0');
    }
    this._count = count;

    const isStaticSize = typeof size === 'number'
    this.isStaticSize = isStaticSize
    if (isStaticSize) this.size = size;
    else this.sizeGetter = size;

    if (!Number.isFinite(count)) {
      this.isFinite = false
      this.totalSize = Infinity
    }
  }

  get count (): number {
    return this._count;
  }

  getTotalSize () {
    const { count } = this
    return this.totalSize ??= this.getRangeSize(0, count - 1);
  }

  getFixedOffset (potentialOffset: number) {
    return this.getEndOffset(this.getIndex(potentialOffset))
  }

  getSize (index: number): number {
    if (this.count === 0) {
      return 0
    }
    if (index >= this.count) {
      return this.getSize(this.count - 1)
    }
    if (index < 0) {
      return this.getSize(0)
    }
    return this.isStaticSize ? this.size : this.sizeGetter(index)
  }

  private pushOffsetToCache (): OffsetCacheItem {
    const { offsetToIndexCache } = this
    const index = offsetToIndexCache.length
    const offset: number = index === 0 ? 0 : offsetToIndexCache[index - 1][1]
    const size = this.getSize(index)
    const result: OffsetCacheItem = [offset, offset + size]
    this.offsetToIndexCache.push(result);
    return result
  }

  getOffset (index: number): number {
    if (this.count === 0 || index <= 0) return 0
    if (!this.isFinite && index === Infinity) return Infinity
    if (index >= this.count) return this.getOffset(this.count - 1);
    if (this.isStaticSize) return index * this.size
    const { offsetToIndexCache } = this
    for (let i = offsetToIndexCache.length; i <= index; i++) this.pushOffsetToCache()
    return offsetToIndexCache[index][0]
  }

  getEndOffset (index: number): number {
    return this.getOffset(index) + this.getSize(index);
  }

  getIndex (offset: number): number {
    const { isStaticSize, size, count } = this;
    if (count === 0) return -1;
    if (offset <= 0) return 0;
    if (isStaticSize) return Math.min(Math.floor(offset / size), count - 1);
    const { offsetToIndexCache } = this;
    let index = offsetToIndexCache.length
    let lastOffset = index === 0 ? 0 : offsetToIndexCache[index - 1][1]
    while (lastOffset <= offset) {
      if (index === count) return count - 1
      const [startOffset, endOffset] = this.pushOffsetToCache()
      if (startOffset < offset) return index
      index++
      lastOffset = endOffset
    }
    return binarySearch(offsetToIndexCache, metricsCreator(offset), SEARCH_TYPE.last);
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