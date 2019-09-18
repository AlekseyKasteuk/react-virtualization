import * as React from 'react'

import GetStyleType from './types/GetStyleType'

import IGridContentProps from "./interfaces/IGridContentProps"
import permutations from './utils/permutations'
import range from './utils/range'

export default class GridContent extends React.PureComponent<IGridContentProps> {
  getStyle: GetStyleType = ({ rowIndex = 0, columnIndex = 0 }) => ({
    position: 'absolute',
    top: `${this.props.rowManager.getPixelByIndex(rowIndex)}px`,
    left: `${this.props.columnManager.getPixelByIndex(columnIndex)}px`,
    height: `${this.props.rowManager.getSize(rowIndex)}px`,
    width: `${this.props.columnManager.getSize(columnIndex)}px`,
    boxSizing: 'border-box',
  })

  render () {
    const {
      cellRenderer: CellRenderer,
      rangeRenderer: RangeRenderer,
      rowsRange,
      columnsRange,
      rowManager,
      columnManager,
    } = this.props

    const cells = CellRenderer && permutations(
      range(columnsRange.start, columnsRange.end), range(rowsRange.start, rowsRange.end)
    ).map(([columnIndex, rowIndex]: [number, number]) => {
      const key = `${rowIndex}:${columnIndex}`
      return (
        <CellRenderer
          key={key}
          rowManager={rowManager}
          columnManager={columnManager}
          rowIndex={rowIndex}
          columnIndex={columnIndex}
          getStyle={this.getStyle}
        />
      )
    })
    const ranges = RangeRenderer && RangeRenderer({
      rowManager,
      columnManager,
      startRowIndex: rowsRange.start,
      endRowIndex: rowsRange.end,
      startColumnIndex: columnsRange.start,
      endColumnIndex: columnsRange.end,
      getStyle: this.getStyle,
    })

    return (
      <React.Fragment>
        { cells }
        { ranges }
      </React.Fragment>
    )
  }
}
