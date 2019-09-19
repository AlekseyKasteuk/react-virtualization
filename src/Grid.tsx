import * as React from 'react'

import IGridProps from "./interfaces/IGridProps"
import RangeType from './types/RangeType'

import SizeAndPositionManager from './managers/SizeAndPositionManager'
import RenderRangersManager, { ScrollTypeEnum } from './managers/RenderRangersManager'
import Background, { BackgroundTypeEnum } from './Background'
import GridContent from './GridContent'
import ScrollWrapper from './ScrollWrapper'

interface IGridState {
  prevProps: Partial<IGridProps>;
  renderRangesManager: RenderRangersManager;
  rowManager: SizeAndPositionManager;
  columnManager: SizeAndPositionManager;
  overscanRowCount: number;
  overscanColumnCount: number;
  scrollLeft: number;
  scrollTop: number;
  rowsRange: RangeType;
  columnsRange: RangeType;
  rowScrollType?: ScrollTypeEnum;
  columnScrollType?: ScrollTypeEnum;
}

const getPrevProps = (props: IGridProps): Partial<IGridProps> => {
  const {
    width, height,
    rowCount, rowHeight, rowManager,
    columnCount, columnWidth, columnManager,
    overscanCount, overscanRowCount, overscanColumnCount,
    scrollToRow, scrollToColumn,
    scrollLeft, scrollTop,
  } = props
  return {
    width, height,
    rowCount, rowHeight, rowManager,
    columnCount, columnWidth, columnManager,
    overscanCount, overscanRowCount, overscanColumnCount,
    scrollToRow, scrollToColumn,
    scrollLeft, scrollTop,
  }
}

const getChangedProps = (props: IGridProps, prevProps: Partial<IGridProps>): boolean => {
  return Object.keys(prevProps).some((key: keyof Partial<IGridProps>) => props[key] !== prevProps[key])
}

const scrollFromProps = (props: IGridProps, state: IGridState) => {
  const { onScroll } = props
  const { scrollLeft, scrollTop } = state
  if (onScroll && (props.scrollLeft !== scrollLeft || props.scrollTop !== scrollTop)) {
    onScroll({ scrollLeft, scrollTop })
  }
}

const getRowManager = (props: IGridProps, state: IGridState): SizeAndPositionManager => {
  if (!props.rowManager && (props.rowHeight !== state.prevProps.rowHeight || props.rowCount !== state.prevProps.rowCount)) {
    return new SizeAndPositionManager({
      count: props.rowCount,
      size: props.rowHeight,
      estimatedFullSize: props.estimatedFullHeight
    })
  }
  return props.rowManager || state.rowManager
}

const getColumnManager = (props: IGridProps, state: IGridState): SizeAndPositionManager => {
  if (!props.columnManager && (props.columnWidth !== state.prevProps.columnWidth || props.columnCount !== state.prevProps.columnCount)) {
    return new SizeAndPositionManager({
      count: props.columnCount,
      size: props.columnWidth,
      estimatedFullSize: props.estimatedFullWidth,
    })
  }
  return props.columnManager || state.columnManager
}

export default class Grid extends React.PureComponent<IGridProps, IGridState> {
  static getDerivedStateFromProps (props: IGridProps, state: IGridState): Partial<IGridState> {
    const hasChanges: boolean = getChangedProps(props, state.prevProps)

    if (!hasChanges) {
      return null
    }

    const changedState: Partial<IGridState> = { prevProps: getPrevProps(props) }

    const rowManager: SizeAndPositionManager = getRowManager(props, state)
    const rowManagerChanged: boolean = state.rowManager !== rowManager
    if (rowManagerChanged) {
      changedState.rowManager = rowManager
    }

    const columnManager: SizeAndPositionManager = getColumnManager(props, state)
    const columnManagerChanged: boolean = state.columnManager !== columnManager
    if (columnManagerChanged) {
      changedState.columnManager = columnManager
    }

    let scrollTop: number = (props.scrollTop === undefined ? state.scrollTop : props.scrollTop) || 0
    let rowScrollType: ScrollTypeEnum = state.rowScrollType
    if (props.scrollToRow !== state.prevProps.scrollToRow && props.scrollToRow !== undefined) {
      rowScrollType = changedState.rowScrollType = undefined
      const rowPixel = rowManager.getPixelByIndex(props.scrollToRow)
      const rowSize = rowManager.getSize(props.scrollToRow)
      if (rowPixel < scrollTop) {
        scrollTop = rowPixel
      } else if (rowPixel + rowSize > scrollTop + props.height) {
        scrollTop = Math.max(0, rowPixel - props.height + rowSize)
      }
    }
    if (state.scrollTop !== scrollTop || rowManagerChanged || props.height !== state.prevProps.height) {
      const overscanRowCount: number = props.overscanRowCount || props.overscanCount || 0
      const rowsRange: RangeType = state.renderRangesManager.getRowsRange(rowManager, scrollTop, props.height, overscanRowCount, rowScrollType)
      if (rowsRange !== state.rowsRange) {
        changedState.rowsRange = rowsRange
      }
      if (overscanRowCount !== state.overscanRowCount) {
        changedState.overscanRowCount = overscanRowCount
      }
    }

    let scrollLeft: number = (props.scrollLeft === undefined ? state.scrollLeft : props.scrollLeft) || 0
    let columnScrollType: ScrollTypeEnum = state.columnScrollType
    if (props.scrollToColumn !== state.prevProps.scrollToColumn && props.scrollToColumn !== undefined) {
      columnScrollType = changedState.columnScrollType = undefined
      const columnPixel = columnManager.getPixelByIndex(props.scrollToColumn)
      const columnSize = columnManager.getSize(props.scrollToColumn)
      if (columnPixel < scrollLeft) {
        scrollLeft = columnPixel
      } else if (columnPixel + columnSize > scrollLeft + props.width) {
        scrollLeft = Math.max(0, columnPixel - props.width + columnSize)
      }
    }

    if (state.scrollLeft !== scrollLeft || columnManagerChanged || props.width !== state.prevProps.width) {
      const overscanColumnCount: number = props.overscanColumnCount || props.overscanCount || 0
      const columnsRange: RangeType = state.renderRangesManager.getColumnsRange(columnManager, scrollLeft, props.width, overscanColumnCount, columnScrollType)
      if (columnsRange !== state.columnsRange) {
        changedState.columnsRange = columnsRange
      }
      if (state.overscanColumnCount !== overscanColumnCount) {
        changedState.overscanColumnCount = overscanColumnCount
      }
    }

    if (state.scrollTop !== scrollTop) {
      changedState.scrollTop = scrollTop
    }
    if (state.scrollLeft !== scrollLeft) {
      changedState.scrollLeft = scrollLeft
    }

    return changedState
  }

  constructor (props : IGridProps) {
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
      rowsRange: renderRangesManager.getRowsRange(rowManager, scrollTop, height, overscanRowCount),
      columnsRange: renderRangesManager.getColumnsRange(columnManager, scrollLeft, width, overscanColumnCount),
    }
  }

  componentDidMount () {
    scrollFromProps(this.props, this.state)
  }

  componentDidUpdate (nextProps: IGridProps, nextState: IGridState) {
    scrollFromProps(nextProps, nextState)
  }

  onScroll = (event: React.UIEvent): void => {
    event.preventDefault()
    const { scrollTop, scrollLeft } = event.currentTarget

    const scrollTopDelta: number = this.state.scrollTop - scrollTop
    const rowScrollType: ScrollTypeEnum = scrollTopDelta === 0 ? this.state.rowScrollType : scrollTopDelta < 0 ? ScrollTypeEnum.After : ScrollTypeEnum.Before
    
    const scrollLeftDelta: number = this.state.scrollLeft - scrollLeft
    const columnScrollType: ScrollTypeEnum = scrollLeftDelta === 0 ? this.state.columnScrollType : scrollLeftDelta < 0 ? ScrollTypeEnum.After : ScrollTypeEnum.Before
    
    if (this.props.onScroll) {
      if (rowScrollType !== this.state.rowScrollType || columnScrollType !== this.state.columnScrollType) {
        this.setState({ rowScrollType, columnScrollType }, () => this.props.onScroll({ scrollTop, scrollLeft }))
      } else {
        this.props.onScroll({ scrollTop, scrollLeft })
      }
    } else {
      const { width, height } = this.props
      const { renderRangesManager, rowManager, columnManager, overscanRowCount, overscanColumnCount } = this.state
      this.setState({
        scrollTop,
        scrollLeft,
        rowScrollType,
        columnScrollType,
        rowsRange: renderRangesManager.getRowsRange(rowManager, scrollTop, height, overscanRowCount, rowScrollType),
        columnsRange: renderRangesManager.getColumnsRange(columnManager, scrollLeft, width, overscanColumnCount, columnScrollType),
      })
    }
  }

  render () {
    const {
      ScrollComponent = ScrollWrapper,
      height,
      width,
      children,
      enableBackgroundLines = false,
      enableBackgroundVerticalLines = enableBackgroundLines,
      enableBackgroundHorizontalLines = enableBackgroundLines,
      backgroundLinesColor = '#e7e7e7',
      verticalBackgroundLinesColor = backgroundLinesColor,
      horizontalBackgroundLinesColor = backgroundLinesColor,
      cellRenderer,
      rangeRenderer,
    } = this.props
    const { scrollLeft, scrollTop, rowManager, columnManager, rowsRange, columnsRange } = this.state

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
              type={BackgroundTypeEnum.Vertical}
              color={verticalBackgroundLinesColor}
              width={columnManager.getPixelByIndex(columnsRange.end) - columnManager.getPixelByIndex(columnsRange.start) + columnManager.getSize(columnsRange.end)}
              height={rowManager.getPixelByIndex(rowsRange.end) - rowManager.getPixelByIndex(rowsRange.start) + rowManager.getSize(rowsRange.end)}
              top={rowManager.getPixelByIndex(rowsRange.start)}
              left={columnManager.getPixelByIndex(columnsRange.start)}
            />
          )
        }
        {
          enableBackgroundHorizontalLines && (
            <Background
              manager={rowManager}
              range={rowsRange}
              type={BackgroundTypeEnum.Horizontal}
              color={horizontalBackgroundLinesColor}
              width={columnManager.getPixelByIndex(columnsRange.end) - columnManager.getPixelByIndex(columnsRange.start) + columnManager.getSize(columnsRange.end)}
              height={rowManager.getPixelByIndex(rowsRange.end) - rowManager.getPixelByIndex(rowsRange.start) + rowManager.getSize(rowsRange.end)}
              top={rowManager.getPixelByIndex(rowsRange.start)}
              left={columnManager.getPixelByIndex(columnsRange.start)}
            />
          )
        }
        <GridContent
          rowManager={rowManager}
          columnManager={columnManager}
          rowsRange={rowsRange}
          columnsRange={columnsRange}
          cellRenderer={cellRenderer}
          rangeRenderer={rangeRenderer}
        />
        { children }
      </ScrollComponent>
    )
  }
}
