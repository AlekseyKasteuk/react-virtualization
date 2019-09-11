import { ScrollWrapperProps } from './ScrollWrapper'
import SizeAndPositionManager from './SizeAndPositionManager'

export type SizeByIndexFunc = (index: number) => number
export type Size = number | SizeByIndexFunc

export interface Props {
  className?: string,
  ScrollComponent?: React.ComponentType<ScrollWrapperProps>,
  width: number,
  height: number,
  overscanCount?: number,
  enableBackgroundLines?: boolean

  onScroll?: (props: { scrollLeft: number, scrollTop: number }) => void,

  cellRenderer?: (
    params: {
      rowIndex: number,
      columnIndex: number,
      rowManager: SizeAndPositionManager,
      columnManager: SizeAndPositionManager,
      style: { position: string, top: string, left: string, width: string, height: string }
    }
  ) => React.ReactNode

  cellRangeRenderer?: (
    params: {
      startRowIndex: number,
      endRowIndex: number,
      startColumnIndex: number,
      endColumnIndex: number,
      rowManager: SizeAndPositionManager,
      columnManager: SizeAndPositionManager,
    }
  ) => React.ReactNode
}

export interface HorizontalListProps extends Props {
  scrollToColumn?: number,
  scrollLeft?: number,

  columnCount?: number,
  columnWidth?: Size,
  columnManager?: SizeAndPositionManager,
}

export interface VerticalListProps extends Props {
  scrollToRow?: number,
  scrollTop?: number,

  rowCount?: number,
  rowHeight?: Size,
  rowManager?: SizeAndPositionManager,
}

export interface GridProps extends HorizontalListProps, VerticalListProps {
  overscanRowCount?: number,
  overscanColumnCount?: number,

  enableBackgroundVerticalLines?: boolean,
  enableBackgroundHorizontalLines?: boolean,
}
