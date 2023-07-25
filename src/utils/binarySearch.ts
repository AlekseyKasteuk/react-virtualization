export enum SEARCH_TYPE {
  last,
  first,
  any,
}

type GetMetricType<T> = (item: T, index: number, list: T[]) => number

const binarySearch = <T>(list: T[], getMetric: GetMetricType<T>, type: SEARCH_TYPE = SEARCH_TYPE.any): number => {
  const length = list.length
  let left = 0;
  let right = length - 1;
  const getMetricsWrapper = (index: number) => getMetric(list[index], index, list)
  while (left <= right) {
    const middle = Math.floor((right - left) / 2 + left)
    const metric = getMetricsWrapper(middle);
    if (metric === 0) {
      if (type === SEARCH_TYPE.first && middle > 0 && getMetricsWrapper(middle - 1) === 0) {
        right = middle - 1
      } else if (type === SEARCH_TYPE.last && middle < length - 1 && getMetricsWrapper(middle + 1) === 0) {
        left = middle + 1
      } else {
        return middle;
      }
    }
    if (metric < 0) {
      right = middle - 1;
    } else {
      left = middle + 1;
    }
  }
  return -1;
}

export default binarySearch;