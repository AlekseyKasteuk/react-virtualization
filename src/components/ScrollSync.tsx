import * as React from 'react'

import OnScrollType from '../types/OnScrollType'

interface IProps {
  children: (props: { scrollTop: number, scrollLeft: number, onScroll: OnScrollType }) => React.ReactNode
}

interface IState {
  scrollTop: number;
  scrollLeft: number;
}

export default class ScrollSync extends React.PureComponent<IProps, IState> {
  state = { scrollTop: 0, scrollLeft: 0 }

  onScroll: OnScrollType = ({ scrollTop = this.state.scrollTop, scrollLeft = this.state.scrollLeft }) => {
    if (this.state.scrollLeft !== scrollTop || this.state.scrollLeft !== scrollLeft) {
      this.setState({ scrollTop, scrollLeft })
    }
  }

  render() {
    const { scrollTop, scrollLeft } = this.state
    return this.props.children({ scrollTop, scrollLeft, onScroll: this.onScroll })
  }
}