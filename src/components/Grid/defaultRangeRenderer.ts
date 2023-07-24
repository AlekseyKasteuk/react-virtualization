import { CSSProperties } from 'react';
import { RangeRendererType } from '../../types';

const defaultRangeRenderer: RangeRendererType = ({
  cellRenderer,
  columnSizeAndPositionManager,
  columnStartIndex,
  columnStopIndex,
  rowSizeAndPositionManager,
  rowStartIndex,
  rowStopIndex,
}) => {
  if (!cellRenderer) {
    return null;
  }
  const cells = [];
  for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
    for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
      const key = `${rowIndex}-${columnIndex}`;
      const style: CSSProperties = {
        position: 'absolute',
        top: rowSizeAndPositionManager.getOffset(rowIndex),
        height: rowSizeAndPositionManager.getSize(rowIndex),
        left: columnSizeAndPositionManager.getOffset(columnIndex),
        width: columnSizeAndPositionManager.getSize(columnIndex),
      }
      cells.push(cellRenderer({ key, rowIndex, columnIndex, rowSizeAndPositionManager, columnSizeAndPositionManager, style }))
    }
  }
  return cells;
}

export default defaultRangeRenderer;