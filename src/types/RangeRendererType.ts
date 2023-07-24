import { SizeAndPositionManager } from '../managers';
import CellRendererType from './CellRendererType';

type RangeRendererParams = {
  height: number;
  rowStartIndex: number;
  rowStopIndex: number;
  rowVisibleStartIndex: number;
  rowVisibleStopIndex: number;
  scrollTop: number;
  rowSizeAndPositionManager: SizeAndPositionManager;
  
  width: number;
  columnStartIndex: number;
  columnStopIndex: number;
  columnVisibleStartIndex: number;
  columnVisibleStopIndex: number;
  scrollLeft: number;
  columnSizeAndPositionManager: SizeAndPositionManager;

  isScrolling: boolean;

  cellRenderer?: CellRendererType;
};

type RangeRendererType = (params: RangeRendererParams) => React.ReactNode;

export default RangeRendererType;