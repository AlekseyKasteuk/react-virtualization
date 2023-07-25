import * as React from 'react'

import Grid, { GridProps } from './Grid'

type ListProps = Omit<
  GridProps,
  'columnSizeAndPositionManager' | 'columnCount' | 'columnWidth' | 'horizontalScrollGroupId'
>

const List: React.FC<ListProps> = (props) => (
  <Grid
    {...props}
    columnCount={1}
    columnWidth={props.width}
    overscanColumnCount={0}
  />
)

export default React.memo(List);