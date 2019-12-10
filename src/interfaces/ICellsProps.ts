import CellRendererType from '../types/CellRendererType'
import RangeType from '../types/RangeType'

import SizeAndPositionManager from '../managers/SizeAndPositionManager'

export default interface ICellsProps {
  rowSizeAndPositionManager: SizeAndPositionManager;
  columnSizeAndPositionManager: SizeAndPositionManager;
  rowStartIndex: number;
  rowStopIndex: number;
  columnStartIndex: number;
  columnStopIndex: number;
  cellRenderer: CellRendererType;
}
