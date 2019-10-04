import * as React from 'react'

import IScrollableAreaProps from '../../interfaces/IScrollableAreaProps'
import Scrollbar, { ScrollbarType } from './Scrollbar'

interface IState {
  isScrollbarsShow: boolean;
}

export default class ScrollableArea extends React.PureComponent<IScrollableAreaProps, IState> {
  ref: React.RefObject<HTMLDivElement> = React.createRef()

  isScrolling: boolean = false
  deltaX: number = 0
  deltaY: number = 0

  state = { isScrollbarsShow: false }

  turnScrollbarsOn = () => this.setState({ isScrollbarsShow: true })
  turnScrollbarsOff = () => this.setState({ isScrollbarsShow: false })

  onWheel = (event: React.WheelEvent) => {
    const { deltaX, deltaY } = event
    this.deltaY += deltaY
    this.deltaX += deltaX
    if (!this.isScrolling) {
      this._scroll()
    }
  }

  private _scroll = () => {
    requestAnimationFrame(() => {
      if (this.deltaY || this.deltaX) {
        let { height, fullHeight, width, fullWidth, scrollTop, scrollLeft, onScroll } = this.props
        if (fullHeight > height) {
          scrollTop = Math.min(Math.max(scrollTop + this.deltaY, 0), fullHeight - height - 1)
        }
        if (fullWidth > width) {
          scrollLeft = Math.min(Math.max(scrollLeft + this.deltaX, 0), fullWidth - width - 1)
        }
        this.deltaY = this.deltaX = 0
        onScroll({ scrollTop, scrollLeft })
      }
      this.isScrolling = false
      })
  }

  render () {
    const { width, height, children, fullWidth, fullHeight, scrollTop, scrollLeft, onScroll } = this.props
    return (
      <div
        role="scroll-area"
        ref={this.ref}
        style={{
          position: 'relative',
          height: `${height}px`,
          width: `${width}px`,
          overflow: 'hidden',
        }}

        onFocus={this.turnScrollbarsOn}
        onTouchStart={this.turnScrollbarsOn}

        onBlur={this.turnScrollbarsOff}
        onTouchEnd={this.turnScrollbarsOff}

        onWheel={this.onWheel}
      >
        {
          fullWidth && fullHeight && (<div
            role="scroll-content"
            style={{
              height: `${fullHeight}px`,
              width: `${fullWidth}px`,
              position: 'absolute',
              top: `${-scrollTop}px`,
              left: `${-scrollLeft}px`,
            }}
          >
            {children}
          </div>)
        }
        {
          fullWidth && width < fullWidth &&
          <Scrollbar
            type={ScrollbarType.Horizontal}
            visibleContentSize={width}
            fullContentSize={fullWidth}
            scrollPosition={scrollLeft}
            onScroll={onScroll}
            scrollbarSize={1}
          />
        }
        {
          fullHeight && height < fullHeight &&
          <Scrollbar
            type={ScrollbarType.Vertical}
            visibleContentSize={height}
            fullContentSize={fullHeight}
            scrollPosition={scrollTop}
            onScroll={onScroll}
            scrollbarSize={1}
          />
        }
      </div>
    )
  }
}
