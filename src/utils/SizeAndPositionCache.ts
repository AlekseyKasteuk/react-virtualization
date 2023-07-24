import binarySearch, { SEARCH_TYPE } from './binarySearch'

type CacheItem = [number, number]

const metricsCreator = (offset: number) =>
  ([start, end]: CacheItem): number => {
    return offset >= start ? offset < end ? 0 : 1 : -1;
  }
export default class SizeAndPositionCache {
  private cache: CacheItem[] = [];

  get lastIndex (): number {
    return this.cache.length - 1;
  }

  get lastOffset (): number {
    const length = this.cache.length
    return length === 0 ? 0 : this.cache[length - 1][0];
  }

  push (start: number, end: number) {
    if (start > end) {
      throw TypeError(`Start ("${start}") is greater than end ("${end}")`)
    }
    const length = this.cache.length
    if (length !== 0 && this.cache[length - 1][1] > start) {
      throw new Error(`Invalid range value: [${start}, ${end}]`)
    }
    this.cache.push([start, end]);
  }

  get (offset: number) {
    return binarySearch(this.cache, metricsCreator(offset), SEARCH_TYPE.last);
  }
}