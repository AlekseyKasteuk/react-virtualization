import * as React from 'react'

import IScrollableAreaProps from '../interfaces/IScrollableAreaProps'

export default class ScrollableArea extends React.PureComponent<IScrollableAreaProps> {
  ref: React.RefObject<HTMLDivElement> = React.createRef()

  componentDidMount () { this._setPosition() }

  componentDidUpdate () { this._setPosition() }

  private _setPosition = () => {
    if (!this.ref.current) {
      return
    }
    const { scrollTop, scrollLeft } = this.props

    this.ref.current.scrollTop = scrollTop
    this.ref.current.scrollLeft = scrollLeft
  }

  render () {
    const { width, height, onScroll, children, fullWidth, fullHeight } = this.props
    return (
      <div
        role="scroll-area"
        ref={this.ref}
        style={{
          height: `${height}px`,
          width: `${width}px`,
          overflow: 'auto',
          overflowX: width === fullWidth ? 'hidden' : 'auto',
          overflowY: height === fullHeight ? 'hidden' : 'auto',
        }}
        onScroll={onScroll}
      >
        {children}
      </div>
    )
  }
}
