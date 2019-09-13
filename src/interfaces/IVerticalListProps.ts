import SizeAndPositionManager from '../managers/SizeAndPositionManager'
import SizeType from '../types/SizeType'
import IBaseProps from './IBaseProps'

export default interface IVerticalListProps extends IBaseProps {
  scrollToRow?: number;
  scrollTop?: number;
  rowCount?: number;
  rowHeight?: SizeType;
  rowManager?: SizeAndPositionManager;
}
