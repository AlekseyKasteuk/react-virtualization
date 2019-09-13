import IScrollWrapperProps from "./IScrollWrapperProps"
import SizeAndPositionManager from '../managers/SizeAndPositionManager'

export default interface IBaseGridProps {
  className?: string;
  ScrollComponent?: React.ComponentType<IScrollWrapperProps>;
  width: number;
  height: number;
  overscanCount?: number;
  enableBackgroundLines?: boolean;
  onScroll?: (props: {
    scrollLeft: number;
    scrollTop: number;
  }) => void;
  cellRenderer?: (params: {
    rowIndex: number;
    columnIndex: number;
    rowManager: SizeAndPositionManager;
    columnManager: SizeAndPositionManager;
    style: React.CSSProperties;
  }) => React.ReactNode;
  cellRangeRenderer?: (params: {
    startRowIndex: number;
    endRowIndex: number;
    startColumnIndex: number;
    endColumnIndex: number;
    rowManager: SizeAndPositionManager;
    columnManager: SizeAndPositionManager;
    getStyle: (rowIndex: number, columnIndex: number) => React.CSSProperties;
  }) => React.ReactNode;
}
