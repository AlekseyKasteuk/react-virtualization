import * as React from 'react'

import Grid from './Grid'

import IVerticalListProps from "../interfaces/IVerticalListProps"
import OnScrollType from '../types/OnScrollType'

export default class List extends React.PureComponent<IVerticalListProps> {
  onScroll: OnScrollType = ({ scrollTop }) => this.props.onScroll({ scrollTop })

  render() {
    return (
      <Grid
        {...this.props}
        onScroll={this.props.onScroll && this.onScroll}
        enableBackgroundVerticalLines={false}
        columnCount={1}
        columnWidth={this.props.width}
        overscanColumnCount={0}
      />
    )
  }
}
