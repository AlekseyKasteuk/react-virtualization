import * as React from 'react'
import { useExtraSize } from '../../hooks/useExtraSize';

import { OnScrollType } from '../../types';

type ScrollHandlerConfig = {
  id: number;
  handler: OnScrollType;
}

const SCROLL_MEDIATOR = new Map<Symbol, ScrollHandlerConfig[]>();

const getAllScrollMediatorHandlers = (id: number, ...scrollIds: Array<Symbol | undefined>) => {
  const uniqScrollIds = Array.from(new Set(scrollIds)).filter(id => id !== undefined)
  return uniqScrollIds.flatMap(scrollId => (SCROLL_MEDIATOR.get(scrollId) || []).filter(c => c.id !== id)).map(c => c.handler);
}

const addToMediator = (scrollId: Symbol, id: number, handler: OnScrollType) => {

  if (!SCROLL_MEDIATOR.has(scrollId)) {
    SCROLL_MEDIATOR.set(scrollId, []);
  }
  const scrollHandler: ScrollHandlerConfig = { id, handler };
  SCROLL_MEDIATOR.get(scrollId).push(scrollHandler);
  return () => {
    const newHandlersList = SCROLL_MEDIATOR.get(scrollId).filter(h => h !== scrollHandler);
    if (newHandlersList.length === 0) {
      SCROLL_MEDIATOR.delete(scrollId);
    } else {
      SCROLL_MEDIATOR.set(scrollId, newHandlersList)
    }
  }
}

const generateId = (() => {
  let id = 0;
  return () => id++;
})()

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
    hideScrollbars?: boolean;
    containerRef: React.MutableRefObject<HTMLDivElement | null>;
    verticalScrollSynchronizationId?: Symbol;
    horizontalScrollSynchronizationId?: Symbol;
    children?: React.ReactNode;
  }
;

const GridContainer: React.FC<GridContainerProps> = (props) => {
  const {
    width, height,
    contentHeight, contentWidth,
    scrollLeft, scrollTop, onScroll,
    children,
    hideScrollbars,
    containerRef,
    verticalScrollSynchronizationId,
    horizontalScrollSynchronizationId,
    ...rest
  } = props;

  const extraSizes = useExtraSize(containerRef, [width, height, contentHeight, contentWidth]);

  const id = React.useMemo(generateId, [])

  React.useEffect(() => {
    if (containerRef.current === null) {
      return
    }
    const container = containerRef.current;
    if (container.scrollLeft !== scrollLeft || container.scrollTop !== scrollTop) {
      container.scrollTo(scrollLeft, scrollTop);
    }
  }, [scrollLeft, scrollTop]);

  React.useEffect(() => {
    if (verticalScrollSynchronizationId) {
      const handler = ({ scrollTop }) => (containerRef.current.scrollTop = scrollTop)
      return addToMediator(verticalScrollSynchronizationId, id, handler)
    }
    return undefined;
  }, [verticalScrollSynchronizationId])
  React.useEffect(() => {
    if (horizontalScrollSynchronizationId) {
      const handler = ({ scrollLeft }) => (containerRef.current.scrollLeft = scrollLeft)
      return addToMediator(horizontalScrollSynchronizationId, id, handler)
    }
    return undefined;
  }, [horizontalScrollSynchronizationId])

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
        if (event.target === containerRef.current) {
          const { scrollTop, scrollLeft } = event.currentTarget
          const params = { scrollTop, scrollLeft, event }
          getAllScrollMediatorHandlers(id, verticalScrollSynchronizationId, horizontalScrollSynchronizationId).forEach(handler => handler(params))
          onScroll(params)
        }
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
