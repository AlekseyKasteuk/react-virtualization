import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { AutoSizer, Grid, SizeAndPositionManager, HorizontalList, List } from '../src'

interface ISelectedCellParams { rowIndex: number, columnIndex: number }
interface ISelectedCellProps {
  selectedCell: ISelectedCellParams,
  getStyle: GetStyleType,
}
type GetStyleType = (rowIndex: number, columnIndex: number) => React.CSSProperties

class SelectedCell extends React.PureComponent<ISelectedCellProps> {
  ref: React.RefObject<HTMLDivElement> = React.createRef()
  
  componentDidMount() {
    this.ref.current.focus()
  }

  componentDidUpdate() {
    this.ref.current.focus()
  }

  render() {
    const { selectedCell: { rowIndex, columnIndex } } = this.props
    return (
      <div
        style={{ ...this.props.getStyle(rowIndex, columnIndex), border: '1px solid red', outline: 'none' }}
        tabIndex={0}
        ref={this.ref}
      />
    )
  }
}

class TestComponent extends React.PureComponent<{}, { selectedCell?: ISelectedCellParams }> {
  state: { selectedCell?: ISelectedCellParams, rowManager: SizeAndPositionManager, columnManager: SizeAndPositionManager } = {
    selectedCell: null,
    rowManager: new SizeAndPositionManager({ count: 100, size: (index) => index % 2 === 0 ? 40 : 50 }),
    columnManager: new SizeAndPositionManager({ count: 100, size: 100 }),
  }

  changeSelectedCellCoords = ({ x = 0, y = 0 }: { x?: number, y?: number }) => {
    if (this.state.selectedCell) {
      const { rowManager, columnManager } = this.state
      const { rowIndex, columnIndex } = this.state.selectedCell
      const newRowIndex = Math.max(0, Math.min(rowManager.count, rowIndex - y))
      const newColumnIndex = Math.max(0, Math.min(columnManager.count, columnIndex - x))
      if (newRowIndex !== rowIndex || newColumnIndex !== columnIndex) {
        this.setState({ selectedCell: { rowIndex: newRowIndex, columnIndex: newColumnIndex } })
      }
    }
  }
  
  onKeyPress = (event: React.KeyboardEvent) => {
    if ([37, 38, 39, 40].indexOf(event.keyCode) > -1) {
      event.preventDefault()
    }
    switch (event.keyCode) {
      case 37: return this.changeSelectedCellCoords({ x: 1 })
      case 38: return this.changeSelectedCellCoords({ y: 1 })
      case 39: return this.changeSelectedCellCoords({ x: -1 })
      case 40: return this.changeSelectedCellCoords({ y: -1 })
    }
  }

  cellRenderer = ({ rowIndex, columnIndex, style }: { rowIndex: number, columnIndex: number, style: any }) => {
    return (
      <div
        style={{ ...style, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        key={`${rowIndex}:${columnIndex}`}
        onClick={() => {
          this.setState({ selectedCell: { rowIndex, columnIndex } })
        }}
      >{rowIndex}-{columnIndex}</div>
    )
  }

  cellRangeRenderer = ({ getStyle }: { getStyle: GetStyleType }) => {
    if (!this.state.selectedCell) {
      return null
    }
    return (
      <SelectedCell
        selectedCell={this.state.selectedCell}
        getStyle={getStyle}
      />
    )
  }
  
  render () {
    const { rowManager, columnManager } = this.state
    const { rowIndex, columnIndex } = this.state.selectedCell || {}
    return (
      <AutoSizer
        onKeyDown={this.onKeyPress}
      >
        {
          ({ width, height }) => (
            <Grid
              width={width}
              height={height}
              rowManager={rowManager}
              columnManager={columnManager}
              overscanCount={3}
              cellRenderer={this.cellRenderer}
              cellRangeRenderer={this.cellRangeRenderer}
              enableBackgroundLines
              scrollToRow={rowIndex}
              scrollToColumn={columnIndex}
            />
          )
        }
      </AutoSizer>
    )
  }
}

ReactDOM.render(
  <TestComponent />,
  document.getElementById("app")
);
