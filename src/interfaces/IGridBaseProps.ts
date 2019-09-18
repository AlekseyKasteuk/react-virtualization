import IScrollWrapperProps from "./IScrollWrapperProps"

import CellRendererType from '../types/CellRendererType'
import OnScrollType from '../types/OnScrollType'
import RangeRendererType from '../types/RangeRendererType'

export default interface IGridBaseGridProps {
  className?: string;
  ScrollComponent?: React.ComponentType<IScrollWrapperProps>;
  width: number;
  height: number;
  overscanCount?: number;
  enableBackgroundLines?: boolean;
  backgroundLinesColor?: string;
  onScroll?: OnScrollType;
  cellRenderer?: CellRendererType;
  rangeRenderer?: RangeRendererType;
}
