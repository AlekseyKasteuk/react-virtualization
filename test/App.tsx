import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { Grid } from '../src'

const cellRenderer = ({ rowIndex, columnIndex, style }: { rowIndex: number, columnIndex: number, style: any }) =>
  (<div style={style} key={`${rowIndex}:${columnIndex}`}>{rowIndex} - {columnIndex}</div>)

ReactDOM.render(
  <Grid
    width={1000}
    height={500}
    rowCount={1000}
    rowHeight={40}
    columnCount={1000}
    columnWidth={100}
    overscanCount={1}
    cellRenderer={cellRenderer}
  />,
  document.getElementById("app")
);
