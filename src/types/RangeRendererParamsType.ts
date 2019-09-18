import GetStyleType from './GetStyleType'

import SizeAndPositionManager from '../managers/SizeAndPositionManager'

type RangeRendererParamsType = {
  startRowIndex: number;
  endRowIndex: number;
  startColumnIndex: number;
  endColumnIndex: number;
  rowManager: SizeAndPositionManager;
  columnManager: SizeAndPositionManager;
  getStyle: GetStyleType;
}

export default RangeRendererParamsType