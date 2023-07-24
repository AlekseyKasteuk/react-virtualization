export enum SEARCH_TYPE {
  last,
  first,
  any,
}

const binarySearch = <T>(
  list: T[],
  getMetric: (a: T, index: number, list: T[]) => number,
  type: SEARCH_TYPE = SEARCH_TYPE.any
): number => {
  const length = list.length
  let start = 0;
  let end = length - 1;
  const getMetricsWrapper = (index: number) => getMetric(list[index], index, list)
  while (start <= end) {
    const middle = Math.floor((end - start) / 2 + start)
    const metric = getMetricsWrapper(middle);
    if (metric === 0) {
      if (type === SEARCH_TYPE.first) {
        let index = middle;
        while (index > 1 && getMetricsWrapper(index - 1) === 0) {
          index--;
        }
        return index
      }
      if (type === SEARCH_TYPE.last) {
        let index = middle;
        while (index < length - 1 && getMetricsWrapper(index + 1) === 0) {
          index++;
        }
        return index
      }
      return middle;
    }
    if (metric < 0) {
      end = middle - 1;
    } else {
      start = middle + 1;
    }
  }
  return -1;
}

export default binarySearch;