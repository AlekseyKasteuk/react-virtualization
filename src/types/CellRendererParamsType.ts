import GetStyleType from './GetStyleType'
import SizeAndPositionManager from '../managers/SizeAndPositionManager'

type CellRendererParamsType = {
  key: string,
  rowIndex: number;
  columnIndex: number;
  rowManager: SizeAndPositionManager;
  columnManager: SizeAndPositionManager;
  getStyle: GetStyleType;
}

export default CellRendererParamsType