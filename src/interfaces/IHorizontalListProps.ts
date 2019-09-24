import SizeAndPositionManager from '../managers/SizeAndPositionManager'
import SizeType from '../types/SizeType'
import IGridBaseProps from './IGridBaseProps'

export default interface IHorizontalListProps extends IGridBaseProps {
  scrollToColumn?: number;
  scrollLeft?: number;
  columnCount?: number;
  columnWidth?: SizeType;
  columnManager?: SizeAndPositionManager;
  columnsCountToAdd?: number;
}
