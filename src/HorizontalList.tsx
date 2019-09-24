import * as React from 'react'

import Grid from './Grid'

import IHorizontalListProps from "./interfaces/IHorizontalListProps"
import OnScrollType from './types/OnScrollType'

export default class HorizontalList extends React.PureComponent<IHorizontalListProps> {
  onScroll: OnScrollType = ({ scrollLeft }) => this.props.onScroll({ scrollLeft })

  render() {
    return (
      <Grid
        {...this.props}
        onScroll={this.props.onScroll && this.onScroll}
        enableBackgroundHorizontalLines={false}
        rowCount={1}
        rowHeight={this.props.height}
        overscanRowCount={0}
      />
    )
  }
}
