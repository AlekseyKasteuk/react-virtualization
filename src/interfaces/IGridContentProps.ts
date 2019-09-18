import CellRendererType from '../types/CellRendererType'
import RangeRendererType from '../types/RangeRendererType'
import RangeType from '../types/RangeType'

import SizeAndPositionManager from '../managers/SizeAndPositionManager'

export default interface IGridContentProps {
  rowManager: SizeAndPositionManager;
  columnManager: SizeAndPositionManager;
  rowsRange: RangeType;
  columnsRange: RangeType;
  cellRenderer?: CellRendererType;
  rangeRenderer?: RangeRendererType;
}
