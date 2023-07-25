import * as React from 'react'

import SizeAndPositionManager from '../../managers/SizeAndPositionManager'
import { CellRendererType, OnScrollType, RangeRendererType } from '../../types'
import { UnrequireKeys } from '../../types/utils';
import defaultRangeRenderer from './defaultRangeRenderer';
import GridContainer, { GridContainerProps } from './GridContainer'
import { useMemoizedCallback } from '../../hooks/useMemoizedCallback';
import { usePreviousValue } from '../../hooks/usePreviosValues';

enum ScrollDirection { Before, After }

export type GridProps =
  UnrequireKeys<
    Omit<
      GridContainerProps,
      'contentWidth' | 'contentHeight' | 'containerRef' | 'ref' | 'onScrollStart' | 'onScrollEnd'
    >,
    'onScroll' | 'scrollTop' | 'scrollLeft'
  > &
  {
    scrollingResetTimeInterval?: number;

    overscanCount?: number;

    rowSizeAndPositionManager: SizeAndPositionManager;
    overscanRowCount?: number;
    scrollToRow?: number;
    rowsContentVisibilityPortion?: number;
    verticalContentPortion?: number;
    
    columnSizeAndPositionManager: SizeAndPositionManager,
    overscanColumnCount?: number;
    scrollToColumn?: number;
    columnsContentVisibilityPortion?: number;
    horizontalContentPortion?: number;

    cellRenderer?: CellRendererType;
    rangeRenderer?: RangeRendererType;
  }
;

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
  offset: number = 0,
  size: number = 0,
  overscanCount: number = 0,
  scrollDirection: ScrollDirection = ScrollDirection.After
) => {
  const visibleStartIndex = manager.getIndex(offset)
  const startOverscan = scrollDirection === ScrollDirection.Before ? overscanCount : 0
  const startIndex = Math.max(visibleStartIndex - startOverscan, 0)

  const visibleEndIndex = manager.getIndex(offset + size);
  const endOverscan = scrollDirection === ScrollDirection.After ? overscanCount : 0
  const endIndex = Math.min(visibleEndIndex + endOverscan, manager.count - 1)

  return { visibleStartIndex, startIndex, visibleEndIndex, endIndex }
}

const getNewScroll = (index: number | undefined, currentScroll: number, maxSize: number, manager: SizeAndPositionManager): number => {
  if (index === undefined) {
    return currentScroll
  }
  const start = manager.getOffset(index)
  if (start < currentScroll) return start
  const size = manager.getSize(index)
  if (size > maxSize) return start
  const endScroll = currentScroll + maxSize
  const end = start + size
  if (endScroll >= end) return currentScroll
  return Math.max(0, end - maxSize)
}

const DEFAULT_PORTION = 100_000;

const ControlledGrid: React.FC<GridProps> = ({
  width, height,
  scrollTop, scrollLeft, onScroll,
  scrollingResetTimeInterval = 0,
  columnSizeAndPositionManager, rowSizeAndPositionManager,
  overscanCount = 0, overscanColumnCount = overscanCount, overscanRowCount = overscanCount,
  horizontalContentPortion = DEFAULT_PORTION, verticalContentPortion = DEFAULT_PORTION,
  rangeRenderer = defaultRangeRenderer, cellRenderer, children,
  scrollToRow, scrollToColumn,
  ...rest
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null)

  const [isScrolling, setIsScrolling] = React.useState(false)
  const [{ horizontalScrollDirection, verticalScrollDirection }, setScrollData] = React.useState({
    horizontalScrollDirection: ScrollDirection.After,
    verticalScrollDirection: ScrollDirection.After,
  })
  const onScrollWrapper = useMemoizedCallback<OnScrollType>((data) => {
    if (data.scrollLeft === scrollLeft && data.scrollTop === scrollTop || !onScroll) {
      return
    }
    setScrollData({
      horizontalScrollDirection: getScrollDirection(scrollLeft, data.scrollLeft, horizontalScrollDirection),
      verticalScrollDirection: getScrollDirection(scrollTop, data.scrollTop, verticalScrollDirection),
    })
    onScroll(data)
  })
  const onScrollStart = React.useCallback(() => setIsScrolling(true), [])
  const onScrollEnd = React.useCallback(() => setIsScrolling(false), [])

  React.useEffect(() => {
    let newScrollTop = getNewScroll(scrollToRow, scrollTop, height, rowSizeAndPositionManager)
    let newScrollLeft = getNewScroll(scrollToColumn, scrollLeft, width, columnSizeAndPositionManager)
    if (newScrollTop !== scrollTop || newScrollLeft !== scrollLeft) {
      onScrollWrapper({ scrollLeft: newScrollLeft, scrollTop: newScrollTop, isUserAction: true })
    }
  }, [scrollToRow, scrollToColumn])

  const verticalCache = React.useRef<Map<any, any>>(new Map());
  const verticalStylesCache = React.useRef<Map<any, React.CSSProperties>>(new Map());
  const verticalComponentCache = React.useRef<Map<any, React.ReactNode>>(new Map());
  
  const horizontalCache = React.useRef<Map<any, any>>(new Map());
  const horizontalStylesCache = React.useRef<Map<any, React.CSSProperties>>(new Map());
  const horizontalComponentCache = React.useRef<Map<any, React.ReactNode>>(new Map());

  const cache = React.useRef<Map<any, any>>(new Map());
  const stylesCache = React.useRef<Map<any, React.CSSProperties>>(new Map());
  const componentCache = React.useRef<Map<any, React.ReactNode>>(new Map());

  const prevRowSizeAndPositionManager = usePreviousValue(rowSizeAndPositionManager)
  const prevColumnSizeAndPositionManager = usePreviousValue(columnSizeAndPositionManager)

  const isRowsChanged = rowSizeAndPositionManager !== prevRowSizeAndPositionManager
  const isColumnsChanged = columnSizeAndPositionManager !== prevColumnSizeAndPositionManager
  if (isRowsChanged) {
    verticalCache.current.clear()
    verticalStylesCache.current.clear()
    verticalComponentCache.current.clear()
  }
  if (isColumnsChanged) {
    horizontalCache.current.clear()
    horizontalStylesCache.current.clear()
    horizontalComponentCache.current.clear()
  }
  if (isRowsChanged || isColumnsChanged) {
    cache.current.clear()
    stylesCache.current.clear()
    componentCache.current.clear()
  }
  

  const horizontalIndices = getRange(columnSizeAndPositionManager, scrollLeft, width, overscanColumnCount, horizontalScrollDirection);
  const verticalIndices = getRange(rowSizeAndPositionManager, scrollTop, height, overscanRowCount, verticalScrollDirection);

  const contentHeight = rowSizeAndPositionManager.getFixedOffset((Math.trunc((scrollTop + height) / horizontalContentPortion) + 1) * horizontalContentPortion);
  const contentWidth = columnSizeAndPositionManager.getFixedOffset((Math.trunc((scrollLeft + width) / verticalContentPortion) + 1) * verticalContentPortion);


  return (
    <GridContainer
      {...rest}
      containerRef={containerRef}
      width={width}
      height={height}
      onScroll={onScrollWrapper}
      onScrollStart={onScrollStart}
      onScrollEnd={onScrollEnd}
      scrollLeft={scrollLeft}
      scrollTop={scrollTop}
      contentHeight={contentHeight}
      contentWidth={contentWidth}
    >
      {
        rangeRenderer({
          isScrolling,
          scrollLeft,
          scrollTop,
          width,
          height,
          rowStartIndex: verticalIndices.startIndex,
          rowStopIndex: verticalIndices.endIndex,
          rowVisibleStartIndex: verticalIndices.visibleStartIndex,
          rowVisibleStopIndex: verticalIndices.visibleEndIndex,
          columnStartIndex: horizontalIndices.startIndex,
          columnStopIndex: horizontalIndices.endIndex,
          columnVisibleStartIndex: horizontalIndices.visibleStartIndex,
          columnVisibleStopIndex: horizontalIndices.visibleEndIndex,
          rowSizeAndPositionManager,
          columnSizeAndPositionManager,
          cellRenderer,
          verticalCache: verticalCache.current,
          verticalStylesCache: verticalStylesCache.current,
          verticalComponentCache: verticalComponentCache.current,
          horizontalCache: horizontalCache.current,
          horizontalStylesCache: horizontalStylesCache.current,
          horizontalComponentCache: horizontalComponentCache.current,
          cache: cache.current,
          stylesCache: stylesCache.current,
          componentCache: componentCache.current,
        })
      }
      {children}
    </GridContainer>
  )
}

const NonControlledGrid: React.FC<GridProps> = (props) => {
  const [{ scrollLeft, scrollTop }, setScrollData] = React.useState({ scrollLeft: 0, scrollTop: 0 })
  const onScroll = React.useCallback<OnScrollType>((data) => {
    const { scrollLeft, scrollTop } = data
    setScrollData({ scrollLeft, scrollTop })
    if (data.isUserAction) {
      props.onScroll?.(data)
    }
  }, [])
  return <ControlledGrid {...props} scrollLeft={scrollLeft} scrollTop={scrollTop} onScroll={onScroll} />
}

const VerticalControlledGrid: React.FC<GridProps> = (props) => {
  const [scrollLeft, setScrollLeft] = React.useState(0)
  const onScroll = React.useCallback<OnScrollType>((data) => {
    setScrollLeft(data.scrollLeft)
    if (data.isUserAction) {
      props.onScroll?.(data)
    }
  }, [props.onScroll])
  return <ControlledGrid {...props} scrollLeft={scrollLeft} onScroll={onScroll} />
}

const HorizontalControlledGrid: React.FC<GridProps> = (props) => {
  const [scrollTop, setScrollTop] = React.useState(0)
  const onScroll = React.useCallback<OnScrollType>((data) => {
    setScrollTop(data.scrollTop)
    if (data.isUserAction) {
      props.onScroll?.(data)
    }
  }, [props.onScroll])
  return <ControlledGrid {...props} scrollTop={scrollTop} onScroll={onScroll} />
}

const FullyControlledGrid: React.FC<GridProps> = (props) => {
  const onScroll = React.useCallback<OnScrollType>((data) => {
    if (data.isUserAction) {
      props.onScroll?.(data)
    }
  }, [props.onScroll])
  return <ControlledGrid {...props} onScroll={onScroll} />
}

const Grid: React.FC<GridProps> = (props) => {
  const isVerticalControlled = typeof props.scrollTop === 'number'
  const isHorizontalControlled = typeof props.scrollLeft === 'number'
  const Component = (
    isVerticalControlled
      ? isHorizontalControlled ? FullyControlledGrid : VerticalControlledGrid
      : isHorizontalControlled ? HorizontalControlledGrid : NonControlledGrid
  )
  return <Component {...props} />
}

export default React.memo(Grid);