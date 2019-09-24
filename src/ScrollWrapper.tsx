import * as React from 'react'

import IScrollWrapperProps from './interfaces/IScrollWrapperProps'

export default class ScrollWrapper extends React.PureComponent<IScrollWrapperProps> {
  ref: React.RefObject<HTMLDivElement> = React.createRef()

  componentDidMount () { this.setPosition() }

  componentDidUpdate () { this.setPosition() }

  setPosition = () => {
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
        <div
          role="scroll-content"
          style={{
            height: `${fullHeight}px`,
            width: `${fullWidth}px`,
            position: 'relative'
          }}
        >
          {children}
        </div>
      </div>
    )
  }
}
