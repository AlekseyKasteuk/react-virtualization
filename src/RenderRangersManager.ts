import SizeAndPositionManager from './SizeAndPositionManager'

interface RowParams {
  rowManager: SizeAndPositionManager,
  scrollTop: number,
  height: number,
  overscanRowCount: number,
}
interface ColumnParams {
  columnManager: SizeAndPositionManager,
  scrollLeft: number,
  width: number,
  overscanColumnCount: number,
}
interface FullParams extends RowParams, ColumnParams {}

export interface Range {
  start: number,
  end: number,
}

export default class RenderRangesManager {
  private rowsRange: Range
  private columnsRange: Range

  getRowsRange ({ rowManager, scrollTop, height, overscanRowCount }: RowParams): Range {
    const start = Math.max(rowManager.getIndexByPixel(scrollTop) - overscanRowCount, 0)
    const end = Math.min(rowManager.getIndexByPixel(scrollTop + height) + overscanRowCount, rowManager.count - 1)
    if (!this.rowsRange || this.rowsRange.start !== start || this.rowsRange.end !== end) {
      this.rowsRange = { start, end }
    }
    return this.rowsRange
  }

  getColumnsRange ({ columnManager, scrollLeft, width, overscanColumnCount }: ColumnParams): Range {
    const start = Math.max(columnManager.getIndexByPixel(scrollLeft) - overscanColumnCount, 0)
    const end = Math.min(columnManager.getIndexByPixel(scrollLeft + width) + overscanColumnCount, columnManager.count - 1)
    if (!this.columnsRange || this.columnsRange.start !== start || this.columnsRange.end !== end) {
      this.columnsRange = { start, end }
    }
    return this.columnsRange
  }

  getRowsAndColumnsRange (params: FullParams): { rows: Range, columns: Range } {
    return {
      rows: this.getRowsRange(params),
      columns: this.getColumnsRange(params),
    }
  }
}