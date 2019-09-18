import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { SelectedCellType } from './types'

import SelectedCell from './apps/SelectedCell'
import SelectedCellContext from './apps/SelectedCellContext'

import { AutoSizer, Grid, SizeAndPositionManager, List, HorizontalList } from '../src'
import { CellRendererParamsType, RangeRendererParamsType } from '../src/types'

interface ITestComponentState {
  selectedCell?: SelectedCellType;
  rowManager: SizeAndPositionManager;
  columnManager: SizeAndPositionManager;
  scrollTop: number;
  scrollLeft: number;
}

class TestComponent extends React.PureComponent<{}, ITestComponentState> {
  state: ITestComponentState = {
    selectedCell: null,

    // rowManager: new SizeAndPositionManager({ count: Infinity, size: 40, estimatedFullSize: 4000 }),
    // columnManager: new SizeAndPositionManager({ count: Infinity, size: 100, estimatedFullSize: 4000 }),

    rowManager: new SizeAndPositionManager({ count: Infinity, size: (index) => index % 2 === 0 ? 40 : 50, estimatedFullSize: 4000 }),
    columnManager: new SizeAndPositionManager({ count: Infinity, size: (index) => (index % 10) * 10 + 40, estimatedFullSize: 4000 }),

    // rowManager: new SizeAndPositionManager({ count: 1000, size: (index) => index % 2 === 0 ? 40 : 50 }),
    // columnManager: new SizeAndPositionManager({ count: 1000, size: (index) => (index % 10) * 10 + 40 }),

    // rowManager: new SizeAndPositionManager({ count: 1000, size: 40 }),
    // columnManager: new SizeAndPositionManager({ count: 1000, size: 100 }),
    scrollTop: 0,
    scrollLeft: 0,
  }

  changeSelectedCellCoords = ({ x = 0, y = 0 }: { x?: number, y?: number }) => {
    if (this.state.selectedCell) {
      const { rowManager, columnManager } = this.state
      const { rowIndex, columnIndex } = this.state.selectedCell
      const newRowIndex = Math.min(Math.max(0, Math.min(rowManager.count, rowIndex - y)), rowManager.count - 1)
      const newColumnIndex = Math.min(Math.max(0, Math.min(columnManager.count, columnIndex - x)), columnManager.count - 1)
      if (newRowIndex !== rowIndex || newColumnIndex !== columnIndex) {
        this.setState({ selectedCell: { rowIndex: newRowIndex, columnIndex: newColumnIndex } })
      }
    }
  }
  
  onKeyPress = (event: React.KeyboardEvent) => {
    if ([27, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
      event.preventDefault()
    }
    switch (event.keyCode) {
      case 27: return this.setState({ selectedCell: null })
      case 37: return this.changeSelectedCellCoords({ x: 1 })
      case 38: return this.changeSelectedCellCoords({ y: 1 })
      case 39: return this.changeSelectedCellCoords({ x: -1 })
      case 40: return this.changeSelectedCellCoords({ y: -1 })
    }
  }

  horizontalCellRenderer = ({ columnIndex, getStyle }: CellRendererParamsType) => {
    return (
      <div
        style={{
          ...getStyle({ columnIndex }),
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRight: '1px solid #ccc',
          borderBottom: '1px solid #aaa',
        }}
      >{columnIndex}</div>
    )
  }

  cellRenderer = ({ rowIndex, columnIndex, getStyle }: CellRendererParamsType) => {
    return (
      <div
        style={{ ...getStyle({ rowIndex, columnIndex }), display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        onClick={() => {
          this.setState({ selectedCell: { rowIndex, columnIndex } })
        }}
      >{rowIndex}-{columnIndex}</div>
    )
  }

  rangeRenderer = (props: RangeRendererParamsType) => {
    return (<SelectedCell {...props} />)
  }

  onScroll = (
    { scrollLeft = this.state.scrollLeft, scrollTop = this.state.scrollTop }:
    { scrollLeft: number, scrollTop: number }
  ): void => {
    this.setState({ scrollLeft, scrollTop })
  }
  
  render () {
    const { rowManager, columnManager, scrollLeft, scrollTop } = this.state
    const { rowIndex, columnIndex } = this.state.selectedCell || {}
    return (
      <AutoSizer
        onKeyDown={this.onKeyPress}
      >
        {
          ({ width, height }) => (
            <div>
              <HorizontalList
                height={40}
                width={width}
                columnManager={columnManager}
                cellRenderer={this.horizontalCellRenderer}
                overscanCount={3}
                scrollLeft={scrollLeft}
              />
              <SelectedCellContext.Provider
                value={{
                  selectedCell: this.state.selectedCell,
                }}
              >
                <Grid
                  width={width}
                  height={height - 40}
                  rowManager={rowManager}
                  columnManager={columnManager}
                  overscanCount={3}
                  cellRenderer={this.cellRenderer}
                  rangeRenderer={this.rangeRenderer}
                  enableBackgroundLines={true}
                  backgroundLinesColor='#ccc'
                  scrollToRow={rowIndex}
                  scrollToColumn={columnIndex}
                  scrollLeft={scrollLeft}
                  scrollTop={scrollTop}
                  onScroll={this.onScroll}
                />
              </SelectedCellContext.Provider>
            </div>
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
