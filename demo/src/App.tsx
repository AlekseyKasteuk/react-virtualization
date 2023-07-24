import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Grid, SizeAndPositionManager, List, HorizontalList, CellRendererType } from 'react-virtualization';
import useResizeObserver from '@react-hook/resize-observer';

import SelectedCellContext from './apps/SelectedCellContext';

const useSize = (target: React.MutableRefObject<HTMLDivElement>) => {
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  useResizeObserver(target, (entry) => setSize(entry.contentRect))
  return size
}

const HORIZONTAL_SCROLL_ID = Symbol('HORIZONTAL_SCROLL_ID');
const VERTICAL_SCROLL_ID = Symbol('VERTICAL_SCROLL_ID');

const cellRenderer: CellRendererType = ({ rowIndex, columnIndex, rowSizeAndPositionManager, columnSizeAndPositionManager }) => {
  const key = `${rowIndex}-${columnIndex}`;
  const style: React.CSSProperties = {
    position: 'absolute',
    top: rowSizeAndPositionManager.getOffset(rowIndex),
    height: rowSizeAndPositionManager.getSize(rowIndex),
    left: columnSizeAndPositionManager.getOffset(columnIndex),
    width: columnSizeAndPositionManager.getSize(columnIndex),
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  }
  return <div key={key} style={style}>{key}</div>
}

const TestComponent: React.FC<{}> = () => {
  const [selectedCell, setSelectedCell] = React.useState(null);
  const [{ scrollLeft, scrollTop }, setScrollState] = React.useState({ scrollLeft: 0, scrollTop: 0 });
  const rowSizeAndPositionManager = React.useMemo(() => new SizeAndPositionManager(200, (index: number) => index % 2 === 0 ? 40 : 80), [])
  const columnSizeAndPositionManager = React.useMemo(() => new SizeAndPositionManager(200, (index: number) => index % 2 === 0 ? 40 : 80), [])

  const ref = React.useRef(null);
  const { width, height } = useSize(ref);

  
  const onHorizontalScroll = React.useCallback(({ scrollLeft }: { scrollLeft: number }) => setScrollState(({ scrollTop }) => ({ scrollLeft, scrollTop })), [])
  const onVerticalScroll = React.useCallback(({ scrollTop }: { scrollTop: number }) => setScrollState(({ scrollLeft }) => ({ scrollLeft, scrollTop })), [])
  const onScroll = React.useCallback(({ scrollTop, scrollLeft }: { scrollTop: number, scrollLeft: number }) => setScrollState({ scrollLeft, scrollTop }), [])

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        width: '100%',
        height: '100%',
      }}
    >
      {
        width > 0 && height > 0 && (<>
          <List
            id='left-table'
            width={30}
            height={height - 30}
            rowSizeAndPositionManager={rowSizeAndPositionManager}
            scrollTop={scrollTop}
            cellRenderer={cellRenderer}
            overscanCount={15}
            onScroll={onVerticalScroll}
          />
          <div>
            <HorizontalList
              id='top-table'
              height={30}
              width={width - 30}
              columnSizeAndPositionManager={columnSizeAndPositionManager}
              cellRenderer={cellRenderer}
              overscanCount={15}
              scrollLeft={scrollLeft}
              onScroll={onHorizontalScroll}
            />
            <SelectedCellContext.Provider
              value={selectedCell}
            >
              <Grid
                id='main-table'
                width={width - 30}
                height={height - 30}
                rowSizeAndPositionManager={rowSizeAndPositionManager}
                columnSizeAndPositionManager={columnSizeAndPositionManager}
                overscanCount={15}
                cellRenderer={cellRenderer}
                scrollToRow={selectedCell?.rowIndex}
                scrollToColumn={selectedCell?.columnIndex}
                scrollLeft={scrollLeft}
                scrollTop={scrollTop}
                onScroll={onScroll}
              />
            </SelectedCellContext.Provider>
          </div>
        </>)
      }
    </div>
  )
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<TestComponent />);
