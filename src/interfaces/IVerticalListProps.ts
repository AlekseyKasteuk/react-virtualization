import SizeAndPositionManager from '../managers/SizeAndPositionManager'
import SizeType from '../types/SizeType'
import IGridBaseProps from './IGridBaseProps'

export default interface IVerticalListProps extends IGridBaseProps {
  scrollToRow?: number;
  scrollTop?: number;
  rowCount?: number;
  rowHeight?: SizeType;
  rowManager?: SizeAndPositionManager;
  rowsCountToAdd?: number;
}
