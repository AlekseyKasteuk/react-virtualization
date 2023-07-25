import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Grid, SizeAndPositionManager, List, HorizontalList, CellRendererType, CellRendererParamsType } from 'react-virtualization';
import useResizeObserver from '@react-hook/resize-observer';

import SelectedCellContext from './apps/SelectedCellContext';
import SelectedCell from './apps/SelectedCell';

const useSize = (target: React.MutableRefObject<HTMLDivElement>) => {
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  useResizeObserver(target, (entry) => setSize(entry.contentRect))
  return size
}

const cellRendererCreator = (getText: (props: CellRendererParamsType) => string): CellRendererType => (props) => {
  const { key, style } = props
  const text = getText(props)
  const fillStyle: React.CSSProperties = {
    ...style,
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
  return <div key={key} style={fillStyle}>{text}</div>
}

const tCellRenderer = cellRendererCreator(({ rowIndex, columnIndex }) => `${rowIndex}-${columnIndex}`)
const vlCellRenderer = cellRendererCreator(({ rowIndex }) => `${rowIndex}`)
const hlCellRenderer = cellRendererCreator(({ columnIndex }) => `${columnIndex}`)

const KEY_MAPPING = {
  ArrowDown: (selectedCell) => selectedCell && ({ ...selectedCell, rowIndex: selectedCell.rowIndex + 1 }),
  ArrowUp: (selectedCell) => selectedCell && ({ ...selectedCell, rowIndex: selectedCell.rowIndex - 1 }),
  ArrowLeft: (selectedCell) => selectedCell && ({ ...selectedCell, columnIndex: selectedCell.columnIndex - 1 }),
  ArrowRight: (selectedCell) => selectedCell && ({ ...selectedCell, columnIndex: selectedCell.columnIndex + 1 }),
}

const createRandomManager = (size: number) => {
  const cache = {}
  return new SizeAndPositionManager(size, (index: number) => cache[index] ??= Math.trunc(Math.random() * 200) + 30)
}

const TestComponent: React.FC<{}> = () => {
  const [selectedCell, setSelectedCell] = React.useState(null);
  const [{ scrollLeft, scrollTop }, setScrollState] = React.useState({ scrollLeft: 0, scrollTop: 0 });
  const rowSizeAndPositionManager = React.useMemo(() => createRandomManager(Infinity), [])
  const columnSizeAndPositionManager = React.useMemo(() => createRandomManager(Infinity), [])

  const ref = React.useRef(null);
  const { width, height } = useSize(ref);

  
  const onHorizontalScroll = React.useCallback(({ scrollLeft }: { scrollLeft: number }) => setScrollState(({ scrollTop }) => ({ scrollLeft, scrollTop })), [])
  const onVerticalScroll = React.useCallback(({ scrollTop }: { scrollTop: number }) => setScrollState(({ scrollLeft }) => ({ scrollLeft, scrollTop })), [])
  const onScroll = React.useCallback(({ scrollTop, scrollLeft }: { scrollTop: number, scrollLeft: number }) => setScrollState({ scrollLeft, scrollTop }), [])

  const onGridClick = React.useCallback((event: React.MouseEvent) => {
    const div = event.target as HTMLDivElement
    const columnIndex = columnSizeAndPositionManager.getIndex(div.offsetLeft)
    const rowIndex = rowSizeAndPositionManager.getIndex(div.offsetTop)
    setSelectedCell({ rowIndex, columnIndex })
  }, [rowSizeAndPositionManager, columnSizeAndPositionManager])

  React.useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const { key } = event
      if (key in KEY_MAPPING) {
        event.preventDefault()
        event.stopImmediatePropagation()
        setSelectedCell((selectedCell) => {
          const lastRowIndex = rowSizeAndPositionManager.count - 1
          const lastColumnIndex = columnSizeAndPositionManager.count - 1
          if (!selectedCell) return selectedCell
          const { rowIndex, columnIndex } = KEY_MAPPING[key](selectedCell)
          return {
            rowIndex: Math.min(lastRowIndex, Math.max(0, rowIndex)),
            columnIndex: Math.min(lastColumnIndex, Math.max(0, columnIndex))
          }
        })
      }
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [rowSizeAndPositionManager, columnSizeAndPositionManager])

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
            className='bbb'
            width={40}
            height={height - 40}
            rowSizeAndPositionManager={rowSizeAndPositionManager}
            scrollTop={scrollTop}
            onScroll={onVerticalScroll}
            cellRenderer={vlCellRenderer}
            overscanCount={15}
            // verticalScrollGroupId='v'
          />
          <Grid
            id='secondary-table'
            className='bbb'
            width={400}
            height={height - 40}
            rowSizeAndPositionManager={rowSizeAndPositionManager}
            columnSizeAndPositionManager={columnSizeAndPositionManager}
            overscanCount={15}
            cellRenderer={tCellRenderer}
            scrollTop={scrollTop}
            onScroll={onVerticalScroll}
            // verticalScrollGroupId='v'
          />
          <div>
            <HorizontalList
              id='top-table'
              className='bbb'
              height={40}
              width={width - 440}
              columnSizeAndPositionManager={columnSizeAndPositionManager}
              cellRenderer={hlCellRenderer}
              overscanCount={15}
              scrollLeft={scrollLeft}
              onScroll={onHorizontalScroll}
              // horizontalScrollGroupId='h'
            />
            <SelectedCellContext.Provider
              value={selectedCell}
            >
              <Grid
                id='main-table'
                className='bbb'
                width={width - 440}
                height={height - 40}
                rowSizeAndPositionManager={rowSizeAndPositionManager}
                columnSizeAndPositionManager={columnSizeAndPositionManager}
                overscanCount={15}
                cellRenderer={tCellRenderer}
                scrollToRow={selectedCell?.rowIndex}
                scrollToColumn={selectedCell?.columnIndex}
                scrollLeft={scrollLeft}
                scrollTop={scrollTop}
                onScroll={onScroll}
                onClick={onGridClick}
                // verticalScrollGroupId='v'
                // horizontalScrollGroupId='h'
              >
                <SelectedCell rowSizeAndPositionManager={rowSizeAndPositionManager} columnSizeAndPositionManager={columnSizeAndPositionManager}  />
              </Grid>
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
