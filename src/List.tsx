import * as React from 'react'

import Grid from './Grid'

import IVerticalListProps from "./interfaces/IVerticalListProps"


const List = (props: IVerticalListProps) => (
  <Grid
    {...props}
    enableBackgroundVerticalLines={false}
    columnCount={1}
    columnWidth={props.width}
    overscanColumnCount={0}
  />
)
export default List
