import RendererParamsType from './RendererParamsType'

interface CellRendererParamsType extends RendererParamsType {
  key: string;
  rowIndex: number;
  columnIndex: number;
  style: React.CSSProperties;
}

type CellRendererType = (props: CellRendererParamsType) => React.ReactNode

export default CellRendererType