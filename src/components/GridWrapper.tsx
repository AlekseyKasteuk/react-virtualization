import * as React from 'react'

import IGridWrapperProps from '../interfaces/IGridWrapperProps'
interface IState {
  extraHeight: number;
  extraWidth: number;
}

export default class GridWrapper extends React.PureComponent<IGridWrapperProps, IState> {
  _scrollingContainer: React.RefObject<HTMLDivElement> = React.createRef()
  
  state = {
    extraHeight: 0,
    extraWidth: 0,
  }

  componentDidMount () { this._setPosition() }

  componentDidUpdate () { this._setPosition() }

  private _setPosition = () => {
    if (!this._scrollingContainer.current) {
      return
    }
    const { scrollTop, scrollLeft, hideScrollbars, onOffsetAdjustmentChange } = this.props

    const scrollTopChanged = this._scrollingContainer.current.scrollTop !== scrollTop
    const scrollLeftChanged = this._scrollingContainer.current.scrollLeft !== scrollLeft
    if (scrollTopChanged || scrollLeftChanged) {
      this._scrollingContainer.current.scrollTo(scrollLeft, scrollTop)
    }

    const extraHeight = this._scrollingContainer.current.offsetHeight - this._scrollingContainer.current.clientHeight
    const extraWidth = this._scrollingContainer.current.offsetWidth - this._scrollingContainer.current.clientWidth
    if (this.state.extraHeight !== extraHeight || this.state.extraWidth !== extraWidth) {
      this.setState(
        { extraHeight, extraWidth },
        () => {
          if (onOffsetAdjustmentChange && !hideScrollbars) {
            onOffsetAdjustmentChange({ vertical: extraHeight, horizontal: extraWidth })
          }
        }
      )
    }
  }

  _onScroll = (event: React.UIEvent) => {
    if (event.target === this._scrollingContainer.current) {
      const { scrollTop, scrollLeft } = event.currentTarget
      this.props.onScroll({ scrollTop, scrollLeft })
    }
  }

  render () {
    const { width, height, children, hideScrollbars, contentHeight, contentWidth } = this.props
    const { extraHeight, extraWidth } = this.state
    const verticalOffset = hideScrollbars ? extraHeight : 0
    const horizontalOffset = hideScrollbars ? extraWidth : 0
    const content = (
      <div
        role="scroll-area"
        ref={this._scrollingContainer}
        style={{
          height: height + verticalOffset,
          width: width + horizontalOffset,
          overflowX: contentWidth > width ? 'scroll' : 'hidden',
          overflowY: contentHeight > height ? 'scroll' : 'hidden',
          marginBottom: -verticalOffset,
          marginRight: -horizontalOffset,
          WebkitOverflowScrolling: 'touch',
        }}
        onScroll={this._onScroll}
      >
        <div
          role="scroll-content"
          style={{
            height: contentHeight,
            width: contentWidth,
            position: 'relative'
          }}
        >
          {children}
        </div>
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
