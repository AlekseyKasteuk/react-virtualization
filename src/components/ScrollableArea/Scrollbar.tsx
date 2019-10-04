import * as React from 'react'

import OnScrollType from '../../types/OnScrollType'

export enum ScrollbarType {
  Vertical,
  Horizontal
}

interface ScrollbarProps {
  type: ScrollbarType;
  scrollbarColor?: string;
  scrollbarSize?: number;
  visibleContentSize: number;
  fullContentSize: number;
  scrollPosition: number;
  onScroll: OnScrollType;
}

const getScrollbarWrapperStyle = ({ type, scrollbarSize = 10, visibleContentSize }: ScrollbarProps): React.CSSProperties => {
  const style: React.CSSProperties = {
    position: 'absolute',
    transition: `${type === ScrollbarType.Horizontal ? 'height' : 'widht'} .3s`
  }
  if (type === ScrollbarType.Horizontal) {
    style.left = 0
    style.bottom = 3
    style.width = `${visibleContentSize}px`
    style.height = `${scrollbarSize}px`
  }
  if (type === ScrollbarType.Vertical) {
    style.right = 3
    style.top = 0
    style.height = `${visibleContentSize}px`
    style.width = `${scrollbarSize}px`
  }
  return style
}

const getScrollbarStyle = ({
  type,
  visibleContentSize,
  fullContentSize,
  scrollPosition,
  scrollbarSize = 10,
  scrollbarColor = '#aaa',
}: ScrollbarProps): React.CSSProperties => {
  const isHorizontal = type === ScrollbarType.Horizontal

  const size = Math.max(Math.floor(visibleContentSize * (visibleContentSize / fullContentSize)), scrollbarSize)
  const position = Math.min(visibleContentSize - size, Math.floor((scrollPosition / fullContentSize) * visibleContentSize))

  return {
    position: 'absolute',
    borderRadius: `${scrollbarSize / 2}px`,
    backgroundColor: scrollbarColor,
    height: isHorizontal ? '100%' : `${size}px`,
    top: isHorizontal ? 0 : `${position}px`,
    left: isHorizontal ? `${position}px` : 0,
    width: isHorizontal ? `${size}px` : '100%',
  }
}

export default class Scrollbar extends React.PureComponent<ScrollbarProps> {
  render () {
    return (
      <div
        role="scrollbar-wrapper"
        style={getScrollbarWrapperStyle(this.props)}
      >
        <div
          role="scrollbar"
          style={getScrollbarStyle(this.props)}
        />
      </div>
    )
  }
}