import * as React from 'react'

import ICellsProps from "../interfaces/ICellsProps"

export default class Cells extends React.PureComponent<ICellsProps> {
  getStyle = ({ rowIndex = 0, columnIndex = 0 }: { rowIndex: number, columnIndex: number }): React.CSSProperties => ({
    position: 'absolute',
    top: this.props.rowSizeAndPositionManager.getPixelByIndex(rowIndex),
    left: this.props.columnSizeAndPositionManager.getPixelByIndex(columnIndex),
    height: this.props.rowSizeAndPositionManager.getSize(rowIndex),
    width: this.props.columnSizeAndPositionManager.getSize(columnIndex),
    boxSizing: 'border-box',
  })

  render () {
    const {
      cellRenderer,
      rowStartIndex,
      rowStopIndex,
      columnStartIndex,
      columnStopIndex,
      rowSizeAndPositionManager,
      columnSizeAndPositionManager,
    } = this.props

    const result = []
    for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
      for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
        const cell = cellRenderer({
          key: `${rowIndex}:${columnIndex}`,
          rowSizeAndPositionManager,
          columnSizeAndPositionManager,
          rowIndex,
          columnIndex,
          style: this.getStyle({ rowIndex, columnIndex }),
        })
        if (cell) {
          result.push(cell)
        }
      }
    }
    return result
  }
}
