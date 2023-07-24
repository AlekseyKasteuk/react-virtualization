import { SizeAndPositionManager } from '../managers';

type CellRendererParamsType = {
  key: string;
  rowIndex: number;
  rowSizeAndPositionManager: SizeAndPositionManager;
  columnIndex: number;
  columnSizeAndPositionManager: SizeAndPositionManager;
  style: React.CSSProperties;
}

type CellRendererType = (props: CellRendererParamsType) => React.ReactNode;

export default CellRendererType;