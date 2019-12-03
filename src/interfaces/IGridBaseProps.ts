import IGridWrapperProps from "./IGridWrapperProps"

import CellRendererType from '../types/CellRendererType'
import OnScrollType from '../types/OnScrollType'
import RangeRendererType from '../types/RangeRendererType'

export default interface IGridBaseGridProps {
  wrapperClassName?: string;
  contentClassName?: string;
  WrapperComponent?: React.ComponentType<IGridWrapperProps>;
  width: number;
  height: number;
  overscanCount?: number;
  enableBackgroundLines?: boolean;
  backgroundLinesColor?: string;
  onScroll?: OnScrollType;
  cellRenderer?: CellRendererType;
  rangeRenderer?: RangeRendererType;
  hideScrollbars?: boolean;
}
