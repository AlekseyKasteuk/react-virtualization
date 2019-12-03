import * as React from 'react'

import IGridWrapperProps from '../interfaces/IGridWrapperProps'

interface IState {
  extraHeight: number;
  extraWidth: number;
}

export default class GridWrapper extends React.PureComponent<IGridWrapperProps, IState> {
  ref: React.RefObject<HTMLDivElement> = React.createRef()
  state = {
    extraHeight: 0,
    extraWidth: 0,
  }

  componentDidMount () { this._setPosition() }

  componentDidUpdate () { this._setPosition() }

  private _setPosition = () => {
    if (!this.ref.current) {
      return
    }
    const { scrollTop, scrollLeft, hideScrollbars } = this.props

    this.ref.current.scrollTop = scrollTop
    this.ref.current.scrollLeft = scrollLeft

    const extraHeight = hideScrollbars ? this.ref.current.offsetHeight - this.ref.current.clientHeight : 0
    const extraWidth = hideScrollbars ? this.ref.current.offsetWidth - this.ref.current.clientWidth : 0
    if (this.state.extraHeight !== extraHeight || this.state.extraWidth !== extraWidth) {
      this.setState({ extraHeight, extraWidth })
    }
  }

  onScroll = (event: React.UIEvent) => {
    const { scrollTop, scrollLeft } = event.currentTarget
    this.props.onScroll({ scrollTop, scrollLeft })
  }

  render () {
    const { width, height, children, hideScrollbars } = this.props
    const { extraHeight, extraWidth } = this.state
    const content = (
      <div
        role="scroll-area"
        ref={this.ref}
        style={{
          height: height + extraHeight,
          width: width + extraWidth,
          overflow: 'auto',
          marginBottom: -extraHeight,
          marginRight: -extraWidth,
        }}
        onScroll={this.onScroll}
      >
        {children}
      </div>
    )
    if (hideScrollbars) {
      return (
        <div style={{ width, height, overflow: 'hidden' }}>
          {content}
        </div>
      )
    }
    return content
  }
}
