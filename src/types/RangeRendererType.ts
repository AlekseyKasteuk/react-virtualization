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

  verticalCache: Map<any, any>;
  verticalStylesCache: Map<any, React.CSSProperties>;
  verticalComponentCache: Map<any, React.ReactNode>;
  
  horizontalCache: Map<any, any>;
  horizontalStylesCache: Map<any, React.CSSProperties>;
  horizontalComponentCache: Map<any, React.ReactNode>;

  cache: Map<any, any>;
  stylesCache: Map<any, React.CSSProperties>;
  componentCache: Map<any, React.ReactNode>;
};

type RangeRendererType = (params: RangeRendererParams) => React.ReactNode;

export default RangeRendererType;