import * as React from 'react'

import Grid, { GridProps } from './Grid'

type HorizontalListProps = Omit<
  GridProps,
  'rowSizeAndPositionManager' | 'rowCount' | 'rowHeight' | 'verticalScrollGroupId'
>

const HorizontalList: React.FC<HorizontalListProps> = (props) => (
  <Grid
    {...props}
    rowCount={1}
    rowHeight={props.height}
    overscanRowCount={0}
  />
)

export default React.memo(HorizontalList);
