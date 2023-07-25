import * as React from 'react'
import { useExtraSize } from '../../hooks/useExtraSize';

import { OnScrollType } from '../../types';
import { AnimationTimeoutId, cancelAnimationTimeout, requestAnimationTimeout } from '../../utils/requestAnimationTimeout';

type ScrollGroupId = string | Symbol;

export type GridContainerProps =
  Omit<React.HTMLProps<HTMLDivElement>, 'onScroll'> &
  {
    width: number;
    height: number;
    contentWidth: number;
    contentHeight: number;
    scrollTop: number;
    scrollLeft: number;
    onScroll: OnScrollType;
    onScrollStart: () => void;
    onScrollEnd: () => void;
    hideScrollbars?: boolean;
    containerRef: React.MutableRefObject<HTMLDivElement | null>;
    verticalScrollGroupId?: ScrollGroupId;
    horizontalScrollGroupId?: ScrollGroupId;
    children?: React.ReactNode;
  }
;

type ScrollRef = GridContainerProps['containerRef']
type ScrollHandler = (scrollPosition: number) => void
type ScrollGroupData = Map<ScrollRef, ScrollHandler>
type ScrollMap = Map<ScrollGroupId, ScrollGroupData>
const HORIZONTAL_SCROLL_GROUPS: ScrollMap = new Map()
const VERTICAL_SCROLL_GROUPS: ScrollMap = new Map()

const registerScroller = (isHorizontal: boolean, groupId: ScrollGroupId, ref: ScrollRef, handler: ScrollHandler) => {
  const groupsMap = isHorizontal ? HORIZONTAL_SCROLL_GROUPS : VERTICAL_SCROLL_GROUPS
  if (!groupsMap.has(groupId)) groupsMap.set(groupId, new Map())
  const handlersMap = groupsMap.get(groupId)
  if (handlersMap.size > 0) {
    const ref = groupsMap.get(groupId).keys().next().value;
    const scrollPosition: number = isHorizontal ? ref.scrollLeft : ref.scrollTop;
    handler(scrollPosition)
  }
  handlersMap.set(ref, handler)
}

const unregisterScroller = (isHorizontal: boolean, groupId: ScrollGroupId, ref: ScrollRef) => {
  const groupsMap = isHorizontal ? HORIZONTAL_SCROLL_GROUPS : VERTICAL_SCROLL_GROUPS
  if (!groupsMap.has(groupId)) return
  const handlersMap = groupsMap.get(groupId)
  if (!handlersMap.has(ref)) return
  handlersMap.delete(ref)
  if (handlersMap.size === 0) groupsMap.delete(groupId)
}

const scroll = (isHorizontal: boolean, groupId: ScrollGroupId, scrollerRef: ScrollRef, scrollPosition: number) => {
  const groupsMap = isHorizontal ? HORIZONTAL_SCROLL_GROUPS : VERTICAL_SCROLL_GROUPS
  if (!groupsMap.has(groupId)) return
  const handlersMap = groupsMap.get(groupId)
  if (!handlersMap.has(scrollerRef)) return
  for (const [ref, handler] of handlersMap.entries()) if (ref !== scrollerRef) handler(scrollPosition)
}

const GridContainer: React.FC<GridContainerProps> = (props) => {
  const {
    width, height,
    contentHeight, contentWidth,
    scrollLeft, scrollTop, onScroll, onScrollStart, onScrollEnd,
    children,
    hideScrollbars,
    containerRef,
    verticalScrollGroupId,
    horizontalScrollGroupId,
    ...rest
  } = props;

  const extraSizes = useExtraSize(containerRef, [width, height, contentHeight, contentWidth]);

  React.useEffect(() => {
    if (verticalScrollGroupId === undefined) return () => {}
    const handler = (scrollTop: number) => {
      const container = containerRef.current
      const currentScrollTop = container.scrollTop
      if (scrollTop === currentScrollTop) return
      isUserAction.current = false
      container.scrollTop = scrollTop;
    }
    registerScroller(false, verticalScrollGroupId, containerRef, handler)
    return () => unregisterScroller(false, verticalScrollGroupId, containerRef)
  }, [verticalScrollGroupId, containerRef])

  React.useEffect(() => {
    if (horizontalScrollGroupId === undefined) return () => {}
    const handler = (scrollLeft: number) => {
      const container = containerRef.current
      const currentScrollLeft = container.scrollLeft
      if (scrollLeft === currentScrollLeft) return
      isUserAction.current = false
      container.scrollLeft = scrollLeft;
    }
    registerScroller(true, horizontalScrollGroupId, containerRef, handler)
    return () => unregisterScroller(true, horizontalScrollGroupId, containerRef)
  }, [horizontalScrollGroupId, containerRef])

  const isUserAction = React.useRef(true)
  const isScrolling = React.useRef(false)
  const frame = React.useRef<AnimationTimeoutId>(null)

  React.useLayoutEffect(() => {
    const container = containerRef.current;
    if (container.scrollLeft !== scrollLeft || container.scrollTop !== scrollTop) {
      isUserAction.current = false
      container.scrollTo(scrollLeft, scrollTop);
    }
  }, [scrollLeft, scrollTop]);

  React.useEffect(() => () => cancelAnimationTimeout(frame.current), [])

  const verticalOffset = hideScrollbars ? extraSizes.height : 0;
  const horizontalOffset = hideScrollbars ? extraSizes.width : 0;
  const content = (
    <div
      {...rest}
      ref={containerRef}
      style={{
        height: height + verticalOffset,
        width: width + horizontalOffset,
        overflowX: contentWidth > width ? 'scroll' : 'hidden',
        overflowY: contentHeight > height ? 'scroll' : 'hidden',
        marginBottom: -verticalOffset,
        marginRight: -horizontalOffset,
        WebkitOverflowScrolling: 'touch',
      }}
      onScroll={(event: React.UIEvent) => {
        if (event.currentTarget !== containerRef.current) return;
        if (!isScrolling.current) {
          isScrolling.current = true
          onScrollStart()
        }
        const { scrollTop, scrollLeft } = event.currentTarget
        const isHorizontalScroll = props.scrollLeft !== scrollLeft
        const isVerticalScroll = props.scrollTop !== scrollTop
        if (isHorizontalScroll || isVerticalScroll) {
          onScroll({ scrollTop, scrollLeft, event, isUserAction: isUserAction.current })
        }
        if (isVerticalScroll && verticalScrollGroupId !== undefined)
          scroll(false, verticalScrollGroupId, containerRef, scrollTop)
        if (isHorizontalScroll && horizontalScrollGroupId !== undefined)
          scroll(true, horizontalScrollGroupId, containerRef, scrollLeft)
        
        cancelAnimationTimeout(frame.current)
        frame.current = requestAnimationTimeout(
          () => {
            onScrollEnd()
            isUserAction.current = true
            isScrolling.current = false
          },
          16
        );
      }}
    >
      <div
        role="scroll-content"
        style={{
          height: contentHeight,
          width: contentWidth,
          position: 'relative'
        }}
      >
        {children}
      </div>
    </div>
  );
  if (hideScrollbars) {
    return (<div style={{ width, height, overflow: 'hidden' }}>{content}</div>);
  }
  return content;
}

export default React.memo(GridContainer);
