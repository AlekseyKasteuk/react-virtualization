import * as React from 'react'

import IGridProps from "../interfaces/IGridProps"

import SizeAndPositionManager from '../managers/SizeAndPositionManager'
import { requestAnimationTimeout, cancelAnimationTimeout, AnimationTimeoutId } from '../utils/requestAnimationTimeout'
import Background, { BackgroundType } from './Background'
import Cells from './Cells'
import GridWrapper from './GridWrapper'

enum ScrollDirection { Before, After }

enum ScrollChangeReason { Requested, Observed }

interface IGridState {
  prevProps: Partial<IGridProps>;
  rowSizeAndPositionManager: SizeAndPositionManager;
  columnSizeAndPositionManager: SizeAndPositionManager;
  isScrolling: boolean;
  scrollLeft: number;
  scrollTop: number;
  rowScrollDirection: ScrollDirection;
  columnScrollDirection: ScrollDirection;
  verticalOffsetAdjustment: number;
  horizontalOffsetAdjustment: number;
}

const getPrevProps = (props: IGridProps): Partial<IGridProps> => {
  const {
    rowCount, rowHeight, rowSizeAndPositionManager,
    columnCount, columnWidth, columnSizeAndPositionManager,
  } = props
  return {
    rowCount, rowHeight,
    columnCount, columnWidth,
    rowSizeAndPositionManager, columnSizeAndPositionManager,
  }
}

const getRowManager = (props: IGridProps, state: IGridState): SizeAndPositionManager => {
  if (
    !props.rowSizeAndPositionManager && (
      state.prevProps.rowSizeAndPositionManager ||
      props.rowHeight !== state.prevProps.rowHeight ||
      props.rowCount !== state.prevProps.rowCount
    )
  ) {
    return new SizeAndPositionManager(props.rowCount, props.rowHeight, props.rowsCountToAdd)
  }
  return props.rowSizeAndPositionManager || state.rowSizeAndPositionManager
}

const getColumnManager = (props: IGridProps, state: IGridState): SizeAndPositionManager => {
  if (
    !props.columnSizeAndPositionManager && (
      state.prevProps.columnSizeAndPositionManager ||
      props.columnWidth !== state.prevProps.columnWidth ||
      props.columnCount !== state.prevProps.columnCount
    )
  ) {
    return new SizeAndPositionManager(props.columnCount, props.columnWidth, props.columnsCountToAdd)
  }
  return props.columnSizeAndPositionManager || state.columnSizeAndPositionManager
}

const getScrollDirection = (
  prevScrollPosition: number,
  nextScrollPosition: number,
  prevScrollDirection: ScrollDirection
): ScrollDirection => {
  const delta: number = prevScrollPosition - nextScrollPosition
  if (delta < 0) {
    return ScrollDirection.After
  }
  if (delta > 0) {
    return ScrollDirection.Before
  }
  return prevScrollDirection
}

const getRange = (
  manager: SizeAndPositionManager,
  scrollPosition: number = 0,
  size: number = 0,
  overscanCount: number = 0,
  scrollDirection: ScrollDirection = ScrollDirection.After
): [number, number] => {
  let startIndex = manager.getIndexByPixel(scrollPosition)
  const startOverscan = scrollDirection === ScrollDirection.Before ? overscanCount : 0
  const start = Math.max(startIndex - startOverscan, 0)

  let endIndex
  let endPixel = scrollPosition + size
  if (endPixel > manager.fullSize && isFinite(manager.count)) {
    endIndex = manager.count - 1
  } else {
    endIndex = manager.getIndexByPixel(endPixel)
  }
  const endOverscan = scrollDirection === ScrollDirection.After ? overscanCount : 0
  const end = Math.min(endIndex + endOverscan, manager.count - 1)

  return [start, end]
}

export default class Grid extends React.PureComponent<IGridProps, IGridState> {
  static getDerivedStateFromProps (props: IGridProps, state: IGridState): Partial<IGridState> {
    const rowSizeAndPositionManager: SizeAndPositionManager = getRowManager(props, state)
    const rowManagerChanged: boolean = state.rowSizeAndPositionManager !== rowSizeAndPositionManager

    const columnSizeAndPositionManager: SizeAndPositionManager = getColumnManager(props, state)
    const columnManagerChanged: boolean = state.columnSizeAndPositionManager !== columnSizeAndPositionManager
    
    if (rowManagerChanged || columnManagerChanged) {
      return {
        prevProps: getPrevProps(props),
        columnSizeAndPositionManager,
        rowSizeAndPositionManager,
      }
    }

    return null
  }

  constructor (props : IGridProps) {
    super(props)
    const {
      rowCount,
      rowHeight,
      rowSizeAndPositionManager = new SizeAndPositionManager(rowCount, rowHeight),
  
      columnCount,
      columnWidth,
      columnSizeAndPositionManager = new SizeAndPositionManager(columnCount, columnWidth),

      scrollLeft = 0,
      scrollTop = 0,
    } = props

    this.state = {
      prevProps: getPrevProps(props),
      rowSizeAndPositionManager,
      columnSizeAndPositionManager,
      isScrolling: false,
      scrollLeft,
      scrollTop,
      rowScrollDirection: ScrollDirection.After,
      columnScrollDirection: ScrollDirection.After,
      verticalOffsetAdjustment: 0,
      horizontalOffsetAdjustment: 0,
    }
  }

  _scrollTimeoutId: AnimationTimeoutId

  componentDidMount () {
    this._scrollToCoordinates()
  }

  componentDidUpdate (prevProps: IGridProps, prevState: IGridState) {
    if (!this.state.isScrolling && !this._scrollToCoordinates(prevProps)) {
      if (
        (this.props.scrollTop !== undefined && this.props.scrollTop !== prevProps.scrollTop) || 
        (this.props.scrollLeft !== undefined && this.props.scrollLeft !== prevProps.scrollLeft)
      ) {
        this.onScroll({ scrollLeft: this.props.scrollLeft, scrollTop: this.props.scrollTop }, ScrollChangeReason.Observed)
      } else if (
        this.props.onScroll &&
        (this.state.scrollTop !== prevState.scrollTop || this.state.scrollLeft !== prevState.scrollLeft)
      ) {
        this.props.onScroll({ scrollTop: this.state.scrollTop, scrollLeft: this.state.scrollLeft })
      }
    }
  }

  _scrollToCoordinates = (prevProps?: IGridProps): boolean => {
    const { width, height } = this.props
    const { columnSizeAndPositionManager, rowSizeAndPositionManager } = this.state
    const { scrollLeft, scrollTop } = this.state

    const scrollToRowChanged = (
      this.props.scrollToRow !== undefined &&
      (!prevProps || this.props.scrollToRow !== prevProps.scrollToRow)
    )
    const scrollToColumnChange = (
      this.props.scrollToColumn !== undefined &&
      (!prevProps || this.props.scrollToColumn !== prevProps.scrollToColumn)
    )
    if (scrollToRowChanged || scrollToColumnChange) {
      const scrollCoordinates: { scrollLeft: number, scrollTop: number } = { scrollLeft, scrollTop }
      if (scrollToRowChanged) {
        const top = rowSizeAndPositionManager.getPixelByIndex(this.props.scrollToRow)
        if (scrollTop > top) {
          scrollCoordinates.scrollTop = top
        } else {
          const bottom = top + rowSizeAndPositionManager.getSize(this.props.scrollToRow)
          if (scrollTop + height < bottom) {
            scrollCoordinates.scrollTop = bottom - height
          }
        }
      }
      if (scrollToColumnChange) {
        const left = columnSizeAndPositionManager.getPixelByIndex(this.props.scrollToColumn)
        if (scrollLeft > left) {
          scrollCoordinates.scrollLeft = left
        } else {
          const right = left + columnSizeAndPositionManager.getSize(this.props.scrollToColumn)
          if (scrollLeft + width < right) {
            scrollCoordinates.scrollLeft = right - width
          }
        }
      }
      this.onScroll(scrollCoordinates, ScrollChangeReason.Requested)
      return true
    }
    return false
  }

  _debounceScrollEnded = () => {
    if (this._scrollTimeoutId !== undefined) {
      cancelAnimationTimeout(this._scrollTimeoutId)
      this._scrollTimeoutId = undefined
    }
  }

  onScroll = (
    { scrollTop = this.state.scrollTop, scrollLeft = this.state.scrollLeft }:
    { scrollTop?: number, scrollLeft?: number },
    scrollChangeReason?: ScrollChangeReason
  ): void => {
    if (this.state.scrollTop === scrollTop && this.state.scrollLeft === scrollLeft) {
      return
    }
    if (scrollChangeReason === undefined || scrollChangeReason === ScrollChangeReason.Requested) {
      if (this.props.onScroll) {
        this.props.onScroll({ scrollTop, scrollLeft })
      }
    }
    if (scrollChangeReason === undefined || scrollChangeReason === ScrollChangeReason.Observed) {
      this._imediateScroll(scrollTop, scrollLeft)
    }
    // this.setState(
    //   {isScrolling: true },
    //   () => {
    //     if (this.props.onScroll) {
    //       this.props.onScroll({ scrollTop, scrollLeft })
    //     }
    //     this._handleScroll(scrollTop, scrollLeft)
    //   }
    // )
  }

  _imediateScroll = (scrollTop: number, scrollLeft: number) => {
    const rowScrollDirection: ScrollDirection = getScrollDirection(this.state.scrollTop, scrollTop, this.state.rowScrollDirection)
    const columnScrollDirection: ScrollDirection = getScrollDirection(this.state.scrollLeft, scrollLeft, this.state.columnScrollDirection)

    this.setState({ scrollTop, scrollLeft, rowScrollDirection, columnScrollDirection, isScrolling: false })
  }

  _scrollTop: number 
  _scrollLeft: number 

  _handleScroll = (scrollTop, scrollLeft): void => {
    // this._debounceScrollEnded()
    this._scrollTop = scrollTop
    this._scrollLeft = scrollLeft
    if (!this._scrollTimeoutId) {
      this._scrollTimeoutId = requestAnimationTimeout(
        () => {
          console.log(this.props.id, this._scrollTop, this._scrollLeft)
          this._imediateScroll(this._scrollTop, this._scrollLeft)
          this._scrollTimeoutId = undefined
        },
        150
      )
    }
  }

  setOffsetAdjustment = (
    { vertical = this.state.verticalOffsetAdjustment, horizontal = this.state.horizontalOffsetAdjustment } :
    { vertical?: number, horizontal?: number }
  ) => {
    if (vertical !== this.state.verticalOffsetAdjustment || horizontal !== this.state.horizontalOffsetAdjustment) {
      this.setState({
        verticalOffsetAdjustment: vertical,
        horizontalOffsetAdjustment: horizontal,
      })
    }
  }

  _getRowsRange = () => {
    const { overscanCount = 0, overscanRowCount = overscanCount, height } = this.props
    const { rowSizeAndPositionManager, scrollTop, rowScrollDirection } = this.state
    return getRange(
      rowSizeAndPositionManager,
      scrollTop,
      height,
      overscanRowCount,
      rowScrollDirection
    )
  }
  
  _getColumnsRange = () => {
    const { overscanCount = 0, overscanColumnCount = overscanCount, width } = this.props
    const { columnSizeAndPositionManager, scrollLeft, columnScrollDirection } = this.state
    return getRange(
      columnSizeAndPositionManager,
      scrollLeft,
      width,
      overscanColumnCount,
      columnScrollDirection
    )
  }

  render () {
    const {
      id,
      className,
      WrapperComponent = GridWrapper,
      height,
      width,
      children,
      enableBackgroundLines = false,
      enableBackgroundVerticalLines = enableBackgroundLines,
      enableBackgroundHorizontalLines = enableBackgroundLines,
      backgroundLinesColor = '#e7e7e7',
      verticalBackgroundLinesColor = backgroundLinesColor,
      horizontalBackgroundLinesColor = backgroundLinesColor,
      onOffsetAdjustmentChange,
      verticalOffsetAdjustment = 0,
      horizontalOffsetAdjustment = 0,
      cellRenderer,
      rangeRenderer,
    } = this.props
    const {
      scrollLeft,
      scrollTop,
      rowSizeAndPositionManager,
      columnSizeAndPositionManager,
      isScrolling,
    } = this.state

    if (!rowSizeAndPositionManager.count || !columnSizeAndPositionManager.count) {
      return null
    }

    const [rowStartIndex, rowStopIndex] = this._getRowsRange()
    const [columnStartIndex, columnStopIndex] = this._getColumnsRange()

    return (
      <WrapperComponent
        id={id}
        className={className}
        width={width}
        height={height}
        onScroll={this.onScroll}
        scrollLeft={scrollLeft}
        scrollTop={scrollTop}
        onOffsetAdjustmentChange={onOffsetAdjustmentChange}
        contentHeight={rowSizeAndPositionManager.fullSize + verticalOffsetAdjustment}
        contentWidth={columnSizeAndPositionManager.fullSize + horizontalOffsetAdjustment}
      >
        {
          enableBackgroundVerticalLines &&
          (
            <Background
              manager={columnSizeAndPositionManager}
              startPixel={columnSizeAndPositionManager.getPixelByIndex(columnStartIndex)}
              endPixel={columnSizeAndPositionManager.getPixelByIndex(columnStopIndex) + columnSizeAndPositionManager.getSize(columnStopIndex)}
              type={BackgroundType.Vertical}
              color={verticalBackgroundLinesColor}
            />
          )
        }
        {
          enableBackgroundHorizontalLines && (
            <Background
              manager={rowSizeAndPositionManager}
              startPixel={rowSizeAndPositionManager.getPixelByIndex(rowStartIndex)}
              endPixel={rowSizeAndPositionManager.getPixelByIndex(rowStopIndex) + rowSizeAndPositionManager.getSize(rowStopIndex)}
              type={BackgroundType.Horizontal}
              color={horizontalBackgroundLinesColor}
            />
          )
        }
        {
          cellRenderer && (
            <Cells
              rowSizeAndPositionManager={rowSizeAndPositionManager}
              columnSizeAndPositionManager={columnSizeAndPositionManager}
              rowStartIndex={rowStartIndex}
              rowStopIndex={rowStopIndex}
              columnStartIndex={columnStartIndex}
              columnStopIndex={columnStopIndex}
              cellRenderer={cellRenderer}
            />
          )
        }
        {
          rangeRenderer && rangeRenderer({
            isScrolling,
            scrollLeft,
            scrollTop,
            width,
            height,
            rowStartIndex,
            rowStopIndex,
            columnStartIndex,
            columnStopIndex,
            rowSizeAndPositionManager,
            columnSizeAndPositionManager,
            verticalOffsetAdjustment,
            horizontalOffsetAdjustment,
          })
        }
        { children }
      </WrapperComponent>
    )
  }
}
