import * as React from 'react'

import { BackgroundType } from './enums'
import { range } from './utils'

import { Range } from './RenderRangersManager'
import SizeAndPositionManager from './SizeAndPositionManager'

export interface BackgroundProps {
  manager: SizeAndPositionManager,
  range: Range,
  type: BackgroundType,
  color?: string,
}

export default class Background extends React.PureComponent<BackgroundProps> {
  canvas = document.createElement('canvas')

  constructor (props: BackgroundProps) {
    super(props)
    if (props.type === BackgroundType.Horizontal) {
      this.canvas.width = 1
    } else {
      this.canvas.height = 1
    }
    this.canvas.height = props.type === BackgroundType.Horizontal ? props.manager.fullSize : 1
    this.canvas.width = props.type === BackgroundType.Horizontal ? 1 : props.manager.fullSize
  }

  getBackground = (): string => {
    const { type, manager, range: { start, end }, color = '#e7e7e7' } = this.props
    const isHirizontal = type === BackgroundType.Horizontal

    this.canvas[isHirizontal ? 'height' : 'width'] = manager.fullSize
    const context = this.canvas.getContext('2d')
    context.fillStyle = color
    if (start >= end) {
      return null
    }
    for (let index of range(start, end)) {
      if (index) {
        const startPixel = manager.getPixelByIndex(index)
        isHirizontal ? context.fillRect(0, startPixel, 1, 1) : context.fillRect(startPixel, 0, 1, 1)
      }
      if (index < manager.count - 1) {
        const endPixel = manager.getPixelByIndex(index) + manager.getSize(index)
        isHirizontal ? context.fillRect(0, endPixel, 1, 1) : context.fillRect(endPixel, 0, 1, 1)
      }
    }
    
    return `url(${this.canvas.toDataURL()})`
  }

  componentWillUnmount () {
    this.canvas.remove()
  }

  render () {
    return (
      <div
       className={this.props.type}
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          zIndex: -1,
          width: '100%',
          height: '100%',
          background: this.getBackground(),
        }}
      />
    )
  }
}
