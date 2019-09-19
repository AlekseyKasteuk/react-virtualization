import * as React from 'react'

import range from './utils/range'

import RangeType from './types/RangeType'
import SizeAndPositionManager from './managers/SizeAndPositionManager'

export enum BackgroundTypeEnum {
  Vertical = 'vertical',
  Horizontal = 'horizontal',
}

interface IBackgroundProps {
  manager: SizeAndPositionManager;
  range: RangeType;
  type: BackgroundTypeEnum;
  color: string;
  width: number;
  height: number;
  top: number;
  left: number;
}

export default class Background extends React.PureComponent<IBackgroundProps> {
  canvas = document.createElement('canvas')

  constructor (props: IBackgroundProps) {
    super(props)
    if (props.type === BackgroundTypeEnum.Horizontal) {
      this.canvas.width = 1
    } else {
      this.canvas.height = 1
    }
    this.canvas.height = props.type === BackgroundTypeEnum.Horizontal ? props.height : 1
    this.canvas.width = props.type === BackgroundTypeEnum.Horizontal ? 1 : props.width
  }

  getBackground = (): string => {
    const { type, manager, range: { start, end }, color, width, height } = this.props
    const isHirizontal = type === BackgroundTypeEnum.Horizontal

    this.canvas.height = isHirizontal ? height : 1
    this.canvas.width = isHirizontal ? 1 : width
    const context = this.canvas.getContext('2d')
    if (start >= end || !context) {
      return ''
    }
    context.fillStyle = color
    const delta = manager.getPixelByIndex(start)
    for (let index of range(start, end)) {
      const startPixel = manager.getPixelByIndex(index)
      const endPixel = manager.getPixelByIndex(index) + manager.getSize(index)
      if (index !== start) {
        isHirizontal ? context.fillRect(0, startPixel - delta, 1, 1) : context.fillRect(startPixel - delta, 0, 1, 1)
      }
      if (index !== end) {
        isHirizontal ? context.fillRect(0, endPixel - delta, 1, 1) : context.fillRect(endPixel - delta, 0, 1, 1)
      }
    }
    
    return `url(${this.canvas.toDataURL()})`
  }

  componentWillUnmount () {
    this.canvas.remove()
  }

  render () {
    const { type, width, height, top, left } = this.props
    return (
      <div
       className={type}
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          zIndex: -1,
          width: `${width}px`,
          height: `${height}px`,
          top: `${top}px`,
          left: `${left}px`,
          background: this.getBackground(),
        }}
      />
    )
  }
}
