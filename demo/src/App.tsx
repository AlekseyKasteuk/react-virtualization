import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { AutoSizer, Grid, SizeAndPositionManager, List, HorizontalList, GridWrapper } from 'react-virtualization'

import { SelectedCellType } from './types'

import SelectedCell from './apps/SelectedCell'
import SelectedCellContext from './apps/SelectedCellContext'

interface ITestComponentState {
  selectedCell?: SelectedCellType;
  rowSizeAndPositionManager: SizeAndPositionManager;
  columnSizeAndPositionManager: SizeAndPositionManager;
  scrollTop: number;
  scrollLeft: number;
  verticalOffsetAdjustment: number;
  horizontalOffsetAdjustment: number;
}

const CustomGridWrapper = (props: any) =>
  <GridWrapper
    {...props}
    hideScrollbars
  />

class TestComponent extends React.PureComponent<{}, ITestComponentState> {
  state: ITestComponentState = {
    selectedCell: null,

    rowSizeAndPositionManager: new SizeAndPositionManager(Infinity, (index) => index % 2 === 0 ? 40 : 80, 100),
    columnSizeAndPositionManager: new SizeAndPositionManager(Infinity, (index) => (index % 10) * 10 + 40, 100),

    // rowSizeAndPositionManager: new SizeAndPositionManager(5, (index) => index % 2 === 0 ? 40 : 50),
    // columnSizeAndPositionManager: new SizeAndPositionManager(5, (index) => (index % 10) * 10 + 40),

    // rowSizeAndPositionManager: new SizeAndPositionManager(100, 60),
    // columnSizeAndPositionManager: new SizeAndPositionManager(100, 80),

    scrollTop: 0,
    scrollLeft: 0,
    verticalOffsetAdjustment: 0,
    horizontalOffsetAdjustment: 0,
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    alert(error.message)
  }

  changeSelectedCellCoords = ({ x = 0, y = 0 }: { x?: number, y?: number }) => {
    if (this.state.selectedCell) {
      const { rowSizeAndPositionManager, columnSizeAndPositionManager } = this.state
      const { rowIndex, columnIndex } = this.state.selectedCell
      const newRowIndex = Math.min(Math.max(0, Math.min(rowSizeAndPositionManager.count, rowIndex - y)), rowSizeAndPositionManager.count - 1)
      const newColumnIndex = Math.min(Math.max(0, Math.min(columnSizeAndPositionManager.count, columnIndex - x)), columnSizeAndPositionManager.count - 1)
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

  listCellRenderer = ({ key, rowIndex, style }: { key: string, rowIndex: number, style: React.CSSProperties }) => {
    return (
      <div
        key={key}
        style={{
          ...style,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRight: '1px solid #aaa',
          borderBottom: '1px solid #ccc',
        }}
      >{rowIndex}</div>
    )
  }

  horizontalCellRenderer = ({ key, columnIndex, style }: { key: string, rowIndex: number, columnIndex: number, style: React.CSSProperties }) => {
    return (
      <div
        key={key}
        style={{
          ...style,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRight: '1px solid #ccc',
          borderBottom: '1px solid #aaa',
        }}
      >{columnIndex}</div>
    )
  }

  cellRenderer = ({ key, rowIndex, columnIndex, style }: { key: string, rowIndex: number, columnIndex: number, style: React.CSSProperties }) => {
    return (
      <div
        key={key}
        style={{
          ...style,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          // borderRight: '1px solid #ccc',
          // borderBottom: '1px solid #ccc',
        }}
        onClick={() => {
          this.setState({ selectedCell: { rowIndex, columnIndex } })
        }}
      >{rowIndex}-{columnIndex}</div>
    )
  }

  rangeRenderer = (props: any) => {
    return (<SelectedCell {...props} />)
  }

  onScroll = (
    { scrollLeft = this.state.scrollLeft, scrollTop = this.state.scrollTop }:
    { scrollLeft: number, scrollTop: number }
  ): void => {
    if (scrollLeft !== this.state.scrollLeft || scrollTop !== this.state.scrollTop) {
      this.setState({ scrollLeft, scrollTop })
    }
  }

  onOffsetAdjustmentChange = ({ vertical, horizontal }: { vertical: number, horizontal: number }) => {
    const { horizontalOffsetAdjustment, verticalOffsetAdjustment } = this.state
    if (vertical !== verticalOffsetAdjustment || horizontal !== horizontalOffsetAdjustment) {
      this.setState({ horizontalOffsetAdjustment: horizontal, verticalOffsetAdjustment: vertical })
    }
  }
  
  render () {
    const {
      rowSizeAndPositionManager,
      columnSizeAndPositionManager,
      scrollLeft,
      scrollTop,
      horizontalOffsetAdjustment,
      verticalOffsetAdjustment,
    } = this.state
    const { rowIndex, columnIndex } = this.state.selectedCell || {}
    return (
      <AutoSizer
        onKeyDown={this.onKeyPress}
      >
        {
          ({ width, height }) => (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
              }}
            >
              <List
                id='left-table'
                width={30}
                height={height - 30}
                rowSizeAndPositionManager={rowSizeAndPositionManager}
                scrollTop={scrollTop}
                cellRenderer={this.listCellRenderer}
                overscanCount={15}
                onScroll={this.onScroll}
                WrapperComponent={CustomGridWrapper}
                verticalOffsetAdjustment={verticalOffsetAdjustment}
              />
              <div>
                <HorizontalList
                  id='top-table'
                  height={30}
                  width={width - 30}
                  columnSizeAndPositionManager={columnSizeAndPositionManager}
                  cellRenderer={this.horizontalCellRenderer}
                  overscanCount={15}
                  scrollLeft={scrollLeft}
                  onScroll={this.onScroll}
                  WrapperComponent={CustomGridWrapper}
                  horizontalOffsetAdjustment={horizontalOffsetAdjustment}
                />
                <SelectedCellContext.Provider
                  value={{
                    selectedCell: this.state.selectedCell,
                  }}
                >
                  <Grid
                    id='main-table'
                    width={width - 30}
                    height={height - 30}
                    rowSizeAndPositionManager={rowSizeAndPositionManager}
                    columnSizeAndPositionManager={columnSizeAndPositionManager}
                    overscanCount={15}
                    cellRenderer={this.cellRenderer}
                    rangeRenderer={this.rangeRenderer}
                    enableBackgroundLines={true}
                    backgroundLinesColor='#ccc'
                    scrollToRow={rowIndex}
                    scrollToColumn={columnIndex}
                    scrollLeft={scrollLeft}
                    scrollTop={scrollTop}
                    onScroll={this.onScroll}
                    onOffsetAdjustmentChange={this.onOffsetAdjustmentChange}
                  />
                </SelectedCellContext.Provider>
              </div>
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
