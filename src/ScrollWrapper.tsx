import * as React from 'react'

import SizeAndPositionManager from './SizeAndPositionManager'

export interface ScrollWrapperProps {
  width: number,
  height: number,
  fullWidth: number,
  fullHeight: number,
  scrollTop: number,
  scrollLeft: number,
  onScroll: (event: React.UIEvent) => void,
  rowManager: SizeAndPositionManager,
  columnManager: SizeAndPositionManager,
  children: React.ReactNode,
}

export default class ScrollWrapper extends React.PureComponent<ScrollWrapperProps> {
  ref: React.RefObject<HTMLDivElement> = React.createRef()

  componentDidMount () { this.setPosition() }

  componentDidUpdate (prevProps: ScrollWrapperProps) {
    this.setPosition()
  }

  setPosition = () => {
    const { scrollTop, scrollLeft } = this.props

    this.ref.current.scrollTop = scrollTop
    this.ref.current.scrollLeft = scrollLeft
  }

  render () {
    const { width, height, onScroll, children, fullWidth, fullHeight } = this.props
    return (
      <div ref={this.ref} style={{ height: `${height}px`, width: `${width}px`, overflow: 'auto' }} onScroll={onScroll}>
        <div style={{ height: `${fullHeight}px`, width: `${fullWidth}px`, position: 'relative' }}>
          {children}
        </div>
      </div>
    )
  }
}
