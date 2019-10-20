import SizeAndPositionManager from './SizeAndPositionManager'

import RangeType from '../types/RangeType'

export enum ScrollTypeEnum {
  Before = 'SCROLL_BEFORE',
  After = 'SCROLL_AFTER',
}

type GetRangeType = (
  manager: SizeAndPositionManager,
  scrollPosition: number,
  size: number,
  overscanCount: number,
  scrollType?: ScrollTypeEnum
) => RangeType

const getRange: GetRangeType = (
  manager,
  scrollPosition,
  size,
  overscanCount,
  scrollType
) => {
  let startIndex = manager.getIndexByPixel(scrollPosition)
  const startOverscan = scrollType === ScrollTypeEnum.Before ? overscanCount : 0
  const start = Math.max(startIndex - startOverscan, 0)

  let endIndex
  try {
    endIndex = manager.getIndexByPixel(scrollPosition + size)
  } catch (ex) {
    endIndex = manager.fullSize
  }
  const endOverscan = scrollType === ScrollTypeEnum.After ? overscanCount : 0
  const end = Math.min(endIndex + endOverscan, manager.count - 1)

  return { start, end }
}

export default class RenderRangesManager {
  private rowsRange?: RangeType
  private columnsRange?: RangeType

  getRowsRange: GetRangeType = (
    rowManager, 
    scrollTop, 
    height, 
    overscanRowCount, 
    rowScrollType = ScrollTypeEnum.After
  ) => {
    const { start, end } = getRange(rowManager, scrollTop, height, overscanRowCount, rowScrollType)
    if (!this.rowsRange || this.rowsRange.start !== start || this.rowsRange.end !== end) {
      this.rowsRange = { start, end }
    }
    return this.rowsRange
  }

  getColumnsRange: GetRangeType = (
    columnManager,
    scrollLeft,
    width,
    overscanColumnCount,
    columnScrollType = ScrollTypeEnum.After
  ) => {
    const { start, end } = getRange(columnManager, scrollLeft, width, overscanColumnCount, columnScrollType)
    if (!this.columnsRange || this.columnsRange.start !== start || this.columnsRange.end !== end) {
      this.columnsRange = { start, end }
    }
    return this.columnsRange
  }
}