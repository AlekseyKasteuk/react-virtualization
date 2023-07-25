import { SizeAndPositionManager } from '../managers';

export type CellRendererParamsType = {
  key: string;
  rowIndex: number;
  rowSizeAndPositionManager: SizeAndPositionManager;
  columnIndex: number;
  columnSizeAndPositionManager: SizeAndPositionManager;
  style: React.CSSProperties;
}

export type CellRendererType = (props: CellRendererParamsType) => React.ReactNode;

export default CellRendererType;