import SizeAndPositionManager from '../managers/SizeAndPositionManager'
import SizeType from '../types/SizeType'
import IBaseProps from './IBaseProps'

export default interface IHorizontalListProps extends IBaseProps {
  scrollToColumn?: number;
  scrollLeft?: number;
  columnCount?: number;
  columnWidth?: SizeType;
  columnManager?: SizeAndPositionManager;
}
