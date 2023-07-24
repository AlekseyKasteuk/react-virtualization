import * as React from 'react'

import SizeAndPositionManager from '../../managers/SizeAndPositionManager'
import { CellRendererType, OnScrollType, RangeRendererType } from '../../types'
import { UnrequireKeys } from '../../types/utils';
import firstArgPipe from '../../utils/firstArgPipe';
import { AnimationTimeoutId, requestAnimationTimeout, cancelAnimationTimeout } from '../../utils/requestAnimationTimeout';
import defaultRangeRenderer from './defaultRangeRenderer';
import GridContainer, { GridContainerProps } from './GridContainer'

enum ScrollDirection { Before, After }

export type GridProps =
  UnrequireKeys<
    Omit<
      GridContainerProps,
      'contentWidth' | 'contentHeight' | 'containerRef' | 'ref'
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
    verticalContentOverscan?: number;
    
    columnSizeAndPositionManager: SizeAndPositionManager,
    overscanColumnCount?: number;
    scrollToColumn?: number;
    columnsContentVisibilityPortion?: number;
    horizontalContentOverscan?: number;

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

const getChangedState = firstArgPipe(
  (changedState, { state, props }) => {
    if (props.scrollTop !== state.prevScrollTop) {
      if (!changedState) {
        changedState = {};
      }
      Object.assign(changedState, { prevScrollTop: props.scrollTop });
      if (!state.isScrolling) {
        Object.assign(changedState, { scrollTop: props.scrollTop });
      }
    }
    return changedState
  },
  (changedState, { state, props }) => {
    if (props.scrollLeft !== state.prevScrollLeft) {
      if (!changedState) {
        changedState = {};
      }
      Object.assign(changedState, { prevScrollLeft: props.scrollLeft });
      if (!state.isScrolling) {
        Object.assign(changedState, { scrollLeft: props.scrollLeft });
      }
    }
    return changedState
  },
  (changedState) => {
    console.log({ changedState })
    return changedState
  }
)

type GridState = {
  isScrolling: boolean,
  scrollTop: number,
  scrollLeft: number,
  horizontalScrollDirection: ScrollDirection,
  verticalScrollDirection: ScrollDirection,
  prevScrollTop?: number,
  prevScrollLeft?: number,
  prevScrollToRow?: number,
  prevScrollToColumn?: number,
}

class Grid extends React.PureComponent<GridProps, GridState> {
  containerRef = React.createRef<HTMLDivElement>();
  scrollingTimeout: AnimationTimeoutId | null = null;

  state: GridState = {
    isScrolling: false,
    scrollTop: 0,
    scrollLeft: 0,
    horizontalScrollDirection: ScrollDirection.After,
    verticalScrollDirection: ScrollDirection.After,
    prevScrollTop: undefined,
    prevScrollLeft: undefined,
    prevScrollToRow: undefined,
    prevScrollToColumn: undefined,
  }

  constructor (props: GridProps) {
    super(props);
    if (props.scrollToRow !== undefined) {
      this.state.prevScrollToRow = props.scrollToRow;
      this.state.scrollTop = props.rowSizeAndPositionManager.getOffset(props.scrollToRow);
    }
    if (props.scrollTop !== undefined) {
      this.state.prevScrollTop = props.scrollTop;
    }
    if (props.scrollToColumn !== undefined) {
      this.state.prevScrollToColumn = props.scrollToColumn;
      this.state.scrollLeft = props.columnSizeAndPositionManager.getOffset(props.scrollToColumn);
    }
    if (props.scrollLeft !== undefined) {
      this.state.prevScrollLeft = props.scrollLeft;
    }
  }

  static getDerivedStateFromProps = (props: GridProps, state: GridState): Partial<GridState> | null => getChangedState(null, { props, state })

  onScroll: OnScrollType = (params) => {
    const { scrollLeft, scrollTop } = params;
    const { state } = this;
    const { onScroll, scrollingResetTimeInterval = 0 } = this.props;

    if (state.scrollLeft === scrollLeft && state.scrollTop === scrollTop) {
      return
    }

    if (this.scrollingTimeout !== null) {
      cancelAnimationTimeout(this.scrollingTimeout);
    }
    const horizontalScrollDirection = getScrollDirection(state.scrollLeft, scrollLeft, state.horizontalScrollDirection);
    const verticalScrollDirection = getScrollDirection(state.scrollTop, scrollTop, state.verticalScrollDirection);

    this.setState({ isScrolling: true, scrollLeft, scrollTop, horizontalScrollDirection, verticalScrollDirection });
    this.scrollingTimeout = requestAnimationTimeout(
      () => {
        this.scrollingTimeout = null;
        this.setState({ isScrolling: false });
      },
      scrollingResetTimeInterval
    );
    onScroll && onScroll(params);
  }

  render () {
    const {
      width, height,
      scrollingResetTimeInterval = 0,
      columnSizeAndPositionManager, rowSizeAndPositionManager,
      overscanCount = 0, overscanColumnCount = overscanCount, overscanRowCount = overscanCount,
      rangeRenderer = defaultRangeRenderer, cellRenderer, children,
      scrollToRow, scrollToColumn,
      ...rest
    } = this.props;
    const {
      isScrolling,
      horizontalScrollDirection,
      verticalScrollDirection,
      scrollLeft,
      scrollTop,
    } = this.state;
    
    const horizontalIndices = getRange(columnSizeAndPositionManager, scrollLeft, width, overscanColumnCount, horizontalScrollDirection);
    const verticalIndices = getRange(rowSizeAndPositionManager, scrollTop, height, overscanRowCount, verticalScrollDirection);

    const contentHeight = rowSizeAndPositionManager.getTotalSize();
    const contentWidth = columnSizeAndPositionManager.getTotalSize();
  
    return (
      <GridContainer
        {...rest}
        containerRef={this.containerRef}
        width={width}
        height={height}
        onScroll={this.onScroll}
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
          })
        }
      </GridContainer>
    )
  }
}

export default Grid;