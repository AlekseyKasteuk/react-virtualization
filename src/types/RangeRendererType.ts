import RendererParamsType from './RendererParamsType'

interface RangeRendererParamsType extends RendererParamsType {
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

type RangeRendererType = (props: RangeRendererParamsType) => React.ReactNode

export default RangeRendererType