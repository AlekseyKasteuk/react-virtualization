import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { Grid } from '../src'

class Test extends React.PureComponent {
  cellRenderer = ({ rowIndex, columnIndex, style }: { rowIndex: number, columnIndex: number, style: any }) =>
    (<div style={style} key={`${rowIndex}:${columnIndex}`}>{rowIndex} - {columnIndex}</div>)
  
  render () {
    return (
      <Grid
        width={1000}
        height={500}
        rowCount={100}
        rowHeight={40}
        columnCount={100}
        columnWidth={100}
        overscanCount={1}
        cellRenderer={this.cellRenderer}
        enableBackgroundLines
      />
    )
  }
}

ReactDOM.render(
  <Test />,
  document.getElementById("app")
);
