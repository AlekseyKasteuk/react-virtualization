import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { AutoSizer, Grid } from '../src'

class Test extends React.PureComponent {
  cellRenderer = ({ rowIndex, columnIndex, style }: { rowIndex: number, columnIndex: number, style: any }) =>
    rowIndex === columnIndex && (<div style={style} key={`${rowIndex}:${columnIndex}`}>{rowIndex}-{columnIndex}</div>)
  
  render () {
    return (
      <AutoSizer>
        {
          ({ width, height }) => (
            <Grid
                width={width}
                height={height}
                rowCount={100}
                rowHeight={40}
                columnCount={100}
                columnWidth={100}
                overscanCount={3}
                cellRenderer={this.cellRenderer}
                enableBackgroundLines
              />
          )
        }
      </AutoSizer>
    )
  }
}

ReactDOM.render(
  <Test />,
  document.getElementById("app")
);
