import IGridWrapperProps from "./IGridWrapperProps"

import CellRendererType from '../types/CellRendererType'
import RangeRendererType from '../types/RangeRendererType'
import OnOffsetAdjustmentChangeType from '../types/OnOffsetAdjustmentChangeType'
import OnScrollType from '../types/OnScrollType'

export default interface IGridBaseGridProps {
  id?: string;
  className?: string;
  WrapperComponent?: React.ComponentType<IGridWrapperProps>;
  width: number;
  height: number;
  overscanCount?: number;
  enableBackgroundLines?: boolean;
  backgroundLinesColor?: string;
  onScroll?: OnScrollType;
  cellRenderer?: CellRendererType;
  rangeRenderer?: RangeRendererType;
  verticalOffsetAdjustment?: number;
  horizontalOffsetAdjustment?: number;
  onOffsetAdjustmentChange?: OnOffsetAdjustmentChangeType
}
