import * as React from 'react'

import { BackgroundType } from './enums'
import { GridProps } from './types'
import { permutations, range } from './utils'

import Background from './Background'
import ScrollWrapper from './ScrollWrapper'
import SizeAndPositionManager from './SizeAndPositionManager'
import RenderRangersManager, { Range } from './RenderRangersManager'

interface GridState {
  prevProps: Partial<GridProps>,
  renderRangesManager: RenderRangersManager,
  rowManager: SizeAndPositionManager,
  columnManager: SizeAndPositionManager,
  overscanRowCount: number,
  overscanColumnCount: number,
  scrollLeft: number,
  scrollTop: number,
  rowsRange: Range,
  columnsRange: Range,
}

const getPrevProps = ({
  width,
  height,

  rowCount,
  rowHeight,
  rowManager,

  columnCount,
  columnWidth,
  columnManager,

  overscanCount,
  overscanRowCount,
  overscanColumnCount,

  scrollToRow,
  scrollToColumn,
  scrollLeft,
  scrollTop,
}: GridProps): Partial<GridProps> => ({
  width,
  height,
  rowCount,
  rowHeight,
  rowManager,
  columnCount,
  columnWidth,
  columnManager,
  overscanCount,
  overscanRowCount,
  overscanColumnCount,
  scrollToRow,
  scrollToColumn,
  scrollLeft,
  scrollTop,
})

function getChangedProps(props: GridProps, prevProps: Partial<GridProps>): boolean {
  return Object.keys(prevProps).some((key: keyof GridProps) => props[key] !== prevProps[key])
}

const scrollFromProps = (props: GridProps, state: GridState) => {
  const { onScroll } = props
  const { scrollLeft, scrollTop } = state
  if (onScroll && (props.scrollLeft !== scrollLeft || props.scrollTop !== scrollTop)) {
    onScroll({ scrollLeft, scrollTop })
  }
}

export default class Grid extends React.PureComponent<GridProps, GridState> {
  static getDerivedStateFromProps (props: GridProps, state: GridState): Partial<GridState> {
    const hasChanges: boolean = getChangedProps(props, state.prevProps)

    if (!hasChanges) {
      return null
    }

    const changedState: Partial<GridState> = { prevProps: getPrevProps(props) }

    let rowManager: SizeAndPositionManager = props.rowManager
    if (!rowManager && (props.rowHeight !== state.prevProps.rowHeight || props.rowCount !== state.prevProps.rowCount)) {
      rowManager = new SizeAndPositionManager({ count: props.rowCount, size: props.rowHeight })
    } else if (!rowManager) {
      rowManager = state.rowManager
    }
    const rowManagerChanged: boolean = state.rowManager !== rowManager
    if (rowManagerChanged) {
      changedState.rowManager = rowManager
    }

    let columnManager: SizeAndPositionManager = props.columnManager
    if (columnManager !== state.prevProps.columnManager) {
    }
    if (!columnManager && (props.columnWidth !== state.prevProps.columnWidth || props.columnCount !== state.prevProps.columnCount)) {
      columnManager = new SizeAndPositionManager({ count: props.columnCount, size: props.columnWidth })
    } else if (!columnManager) {
      columnManager = state.columnManager
    }
    const columnManagerChanged: boolean = state.columnManager !== columnManager
    if (columnManagerChanged) {
      changedState.columnManager = columnManager
    }

    let scrollTop: number = (props.scrollTop === undefined ? state.scrollTop : props.scrollTop) || 0
    if (props.scrollToRow !== state.prevProps.scrollToRow && props.scrollToRow !== undefined) {
      const rowPixel = rowManager.getPixelByIndex(props.scrollToRow)
      const rowSize = rowManager.getSize(props.scrollToRow)
      if (rowPixel < scrollTop) {
        scrollTop = rowPixel
      } else if (rowPixel + rowSize > scrollTop + props.height) {
        scrollTop = Math.max(0, rowPixel - props.height + rowSize)
      }
    }
    if (state.scrollTop !== scrollTop) {
      changedState.scrollTop = scrollTop
    }
    if (state.scrollTop !== scrollTop || rowManagerChanged || props.height !== state.prevProps.height) {
      const overscanRowCount: number = props.overscanRowCount || props.overscanCount || 0
      const rowsRange: Range = state.renderRangesManager.getRowsRange({ rowManager, scrollTop, height: props.height, overscanRowCount })
      if (rowsRange !== state.rowsRange) {
        changedState.rowsRange = rowsRange
      }
      if (overscanRowCount !== state.overscanRowCount) {
        changedState.overscanRowCount = overscanRowCount
      }
    }

    let scrollLeft: number = (props.scrollLeft === undefined ? state.scrollLeft : props.scrollLeft) || 0
    if (props.scrollToColumn !== state.prevProps.scrollToColumn && props.scrollToColumn !== undefined) {
      const columnPixel = columnManager.getPixelByIndex(props.scrollToColumn)
      const columnSize = columnManager.getSize(props.scrollToColumn)
      if (columnPixel < scrollLeft) {
        scrollLeft = columnPixel
      } else if (columnPixel + columnSize > scrollLeft + props.width) {
        scrollLeft = Math.max(0, columnPixel - props.width + columnSize)
      }
    }
    if (state.scrollLeft !== scrollLeft) {
      changedState.scrollLeft = scrollLeft
    }
    if (state.scrollLeft !== scrollLeft || columnManagerChanged || props.width !== state.prevProps.width) {
      const overscanColumnCount: number = props.overscanColumnCount || props.overscanCount || 0
      const columnsRange: Range = state.renderRangesManager.getColumnsRange({ columnManager, scrollLeft, width: props.width, overscanColumnCount })
      if (columnsRange !== state.columnsRange) {
        changedState.columnsRange = columnsRange
      }
      if (state.overscanColumnCount !== overscanColumnCount) {
        changedState.overscanColumnCount = overscanColumnCount
      }
    }

    return changedState
  }

  constructor (props : GridProps) {
    super(props)
    const {
      width,
      height,

      rowCount,
      rowHeight,
      rowManager = new SizeAndPositionManager({ count: rowCount, size: rowHeight, }),
  
      columnCount,
      columnWidth,
      columnManager = new SizeAndPositionManager({ count: columnCount, size: columnWidth, }),

      overscanCount = 0,
      overscanRowCount = overscanCount,
      overscanColumnCount = overscanCount,

      scrollToRow,
      scrollToColumn,
    } = props
    let { scrollLeft = 0, scrollTop = 0 } = props
    if (scrollToRow !== undefined) {
      scrollTop = rowManager.getPixelByIndex(scrollToRow)
    }
    if (scrollToColumn !== undefined) {
      scrollLeft = columnManager.getPixelByIndex(scrollToColumn)
    }
    const renderRangesManager = new RenderRangersManager()
    this.state = {
      prevProps: getPrevProps(props),
      renderRangesManager,
      rowManager,
      columnManager,
      overscanRowCount,
      overscanColumnCount,
      scrollLeft,
      scrollTop,
      rowsRange: renderRangesManager.getRowsRange({ rowManager, scrollTop, height, overscanRowCount }),
      columnsRange: renderRangesManager.getColumnsRange({ columnManager, scrollLeft, width, overscanColumnCount }),
    }
  }

  componentDidMount () {
    scrollFromProps(this.props, this.state)
  }

  componentDidUpdate (nextProps: GridProps, nextState: GridState) {
    scrollFromProps(nextProps, nextState)
  }

  onScroll = (event: React.UIEvent): void => {
    const { scrollTop, scrollLeft } = event.currentTarget
    if (this.props.onScroll) {
      this.props.onScroll({ scrollTop, scrollLeft })
    } else {
      const { width, height } = this.props
      const { renderRangesManager, rowManager, columnManager, overscanRowCount, overscanColumnCount } = this.state
      this.setState({
        scrollTop,
        scrollLeft,
        rowsRange: renderRangesManager.getRowsRange({ rowManager, scrollTop, height, overscanRowCount }),
        columnsRange: renderRangesManager.getColumnsRange({ columnManager, scrollLeft, width, overscanColumnCount }),
      })
    }
  }

  getStyle = (rowIndex: number, columnIndex: number): React.CSSProperties => ({
    position: 'absolute',
    top: `${this.state.rowManager.getPixelByIndex(rowIndex)}px`,
    left: `${this.state.columnManager.getPixelByIndex(columnIndex)}px`,
    height: `${this.state.rowManager.getSize(rowIndex)}px`,
    width: `${this.state.columnManager.getSize(columnIndex)}px`,
  })

  render () {
    const {
      ScrollComponent = ScrollWrapper,
      height,
      width,
      children,
      enableBackgroundLines = false,
      enableBackgroundVerticalLines = enableBackgroundLines,
      enableBackgroundHorizontalLines = enableBackgroundLines,
      cellRenderer,
      cellRangeRenderer,
    } = this.props
    const {
      scrollLeft,
      scrollTop,
      rowManager,
      columnManager,
      rowsRange,
      columnsRange,
    } = this.state

    const cells = cellRenderer && permutations(
      range(rowsRange.start, rowsRange.end), range(columnsRange.start, columnsRange.end)
    ).map(([rowIndex, columnIndex]: [number, number]) => {
      return cellRenderer({ rowManager, columnManager, rowIndex, columnIndex, style: this.getStyle(rowIndex, columnIndex) })
    })
    const ranges = cellRangeRenderer && cellRangeRenderer({
      rowManager,
      columnManager,
      startRowIndex: rowsRange.start,
      endRowIndex: rowsRange.end,
      startColumnIndex: columnsRange.start,
      endColumnIndex: columnsRange.end,
      getStyle: this.getStyle,
    })

    return (
      <ScrollComponent
        width={width}
        height={height}
        onScroll={this.onScroll}
        scrollLeft={scrollLeft}
        scrollTop={scrollTop}
        rowManager={rowManager}
        columnManager={columnManager}
        fullHeight={rowManager.fullSize}
        fullWidth={columnManager.fullSize}
      >
        {
          enableBackgroundVerticalLines &&
          (
            <Background
              manager={columnManager}
              range={columnsRange}
              type={BackgroundType.Vertical}
            />
          )
        }
        {
          enableBackgroundHorizontalLines && (
            <Background
              manager={rowManager}
              range={rowsRange}
              type={BackgroundType.Horizontal}
            />
          )
        }
        { cells }
        { ranges }
        { children }
      </ScrollComponent>
    )
  }
}
