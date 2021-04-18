import RendererParamsType from './RendererParamsType'

interface CellRangeRendererParamsType extends RendererParamsType {
  columnStartIndex: number;
  columnStopIndex: number;
  rowStartIndex: number;
  rowStopIndex: number;
  isScrolling: boolean;
  scrollLeft: number;
  scrollTop: number;
  width: number;
  height: number;
  horizontalOffsetAdjustment: number;
  verticalOffsetAdjustment: number;
}

type CellRangeRendererType = (props: CellRangeRendererParamsType) => React.ReactNode

export default CellRangeRendererType