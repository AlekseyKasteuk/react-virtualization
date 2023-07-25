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
  componentCache,
  stylesCache,
}) => {
  if (!cellRenderer) {
    return null;
  }
  const cells = [];
  for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
    for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
      const key = `${rowIndex}-${columnIndex}`;
      const componentKey = `cell-component:${key}`;
      if (!componentCache.has(componentKey)) {
        const styleKey = `styles:${key}`;
        if (!stylesCache.has(styleKey)) {
          const style: CSSProperties = {
            position: 'absolute',
            top: rowSizeAndPositionManager.getOffset(rowIndex),
            height: rowSizeAndPositionManager.getSize(rowIndex),
            left: columnSizeAndPositionManager.getOffset(columnIndex),
            width: columnSizeAndPositionManager.getSize(columnIndex),
          }
          stylesCache.set(styleKey, style)
        }
        const style = stylesCache.get(styleKey)
        componentCache.set(componentKey, cellRenderer({ key, rowIndex, columnIndex, rowSizeAndPositionManager, columnSizeAndPositionManager, style }))
      }
      cells.push(componentCache.get(componentKey))
    }
  }
  return cells;
}

export default defaultRangeRenderer;