import * as React from 'react';

import SizeAndPositionManager from '../../managers/SizeAndPositionManager';
import { SizeType } from '../../types';
import { ReplaceWithAlternative } from '../../types/utils';
import Grid, { GridProps } from './Grid'

export type GridWithManagersProps = ReplaceWithAlternative<
  GridProps,
  'rowSizeAndPositionManager' | 'columnSizeAndPositionManager',
  {
    rowCount: number;
    rowHeight: SizeType;
    columnCount: number;
    columnWidth: SizeType;
  }
>;

const useSizeAndPositionManager = (
  count: number,
  size: SizeType,
  manager?: SizeAndPositionManager
) => React.useMemo(
  () => manager || new SizeAndPositionManager(count, size),
  [count, size, manager]
);

const GridWithManagers = React.forwardRef<Grid, GridWithManagersProps>(({
  rowCount = 0, rowHeight = 0, rowSizeAndPositionManager,
  columnCount = 0, columnWidth = 0, columnSizeAndPositionManager,
  ...props
}, ref) => {
  const rowManager = useSizeAndPositionManager(rowCount, rowHeight, rowSizeAndPositionManager);
  const columnManager = useSizeAndPositionManager(columnCount, columnWidth, columnSizeAndPositionManager);
  return (
    <Grid
      {...props}
      rowSizeAndPositionManager={rowManager}
      columnSizeAndPositionManager={columnManager}
      ref={ref}
    />
  )
})

export default React.memo(GridWithManagers);
