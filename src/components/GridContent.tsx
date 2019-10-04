import * as React from 'react'

import GetStyleType from '../types/GetStyleType'

import IGridContentProps from "../interfaces/IGridContentProps"
import permutations from '../utils/permutations'
import range from '../utils/range'

export default class GridContent extends React.PureComponent<IGridContentProps> {
  getStyle: GetStyleType = ({ rowIndex = 0, columnIndex = 0 }) => ({
    position: 'absolute',
    top: `${this.props.rowManager.getPixelByIndex(rowIndex)}px`,
    left: `${this.props.columnManager.getPixelByIndex(columnIndex)}px`,
    height: `${this.props.rowManager.getSize(rowIndex)}px`,
    width: `${this.props.columnManager.getSize(columnIndex)}px`,
    boxSizing: 'border-box',
  })

  private getCells = () => {
    const {
      cellRenderer: CellRenderer,
      rowsRange,
      columnsRange,
      rowManager,
      columnManager,
    } = this.props

    if (CellRenderer) {
      const cellsCoods = permutations(range(columnsRange.start, columnsRange.end), range(rowsRange.start, rowsRange.end))
      return cellsCoods.map(([columnIndex, rowIndex]: [number, number]) => {
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
    }
    return null
  }

  private getRange = () => {
    const {
      rangeRenderer: RangeRenderer,
      rowsRange,
      columnsRange,
      rowManager,
      columnManager,
    } = this.props
    
    return RangeRenderer && (
      <RangeRenderer
        rowManager={rowManager}
        columnManager={columnManager}
        startRowIndex={rowsRange.start}
        endRowIndex={rowsRange.end}
        startColumnIndex={columnsRange.start}
        endColumnIndex={columnsRange.end}
        getStyle={this.getStyle}
      />
    )
  }

  render () {
    return (
      <React.Fragment>
        { this.getCells() }
        { this.getRange() }
      </React.Fragment>
    )
  }
}
