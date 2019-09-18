import * as React from 'react'

import Grid from './Grid'

import IHorizontalListProps from "./interfaces/IHorizontalListProps"

const HorizontalList = (props: IHorizontalListProps) => (
  <Grid
    {...props}
    enableBackgroundHorizontalLines={false}
    rowCount={1}
    rowHeight={props.height}
    overscanRowCount={0}
  />
)
export default HorizontalList
