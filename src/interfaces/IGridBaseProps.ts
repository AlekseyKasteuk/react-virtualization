import IGridWrapperProps from "./IGridWrapperProps"

import CellRendererType from '../types/CellRendererType'
import CellRangeRendererType from '../types/CellRangeRendererType'
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
  rangeRenderer?: CellRangeRendererType;
  verticalOffsetAdjustment?: number;
  horizontalOffsetAdjustment?: number;
  onOffsetAdjustmentChange?: OnOffsetAdjustmentChangeType
}
