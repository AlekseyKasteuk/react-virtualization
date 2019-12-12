import * as React from 'react'

import range from '../utils/range'

import SizeAndPositionManager from '../managers/SizeAndPositionManager'

const MAX_CANVAS_SIZE = 8000

export enum BackgroundType {
  Vertical = 'vertical',
  Horizontal = 'horizontal',
}

interface IBackgroundProps {
  manager: SizeAndPositionManager;
  startPixel: number;
  endPixel: number;
  type: BackgroundType;
  color: string;
}

export default class Background extends React.PureComponent<IBackgroundProps> {
  _maxIndex: number = 0
  _maxSize: number = 0
  _color: string
  _manager: SizeAndPositionManager
  _backgrounds: string[] = []

  getBackgrounds = (): React.CSSProperties[] => {
    const { type, manager, startPixel, endPixel, color } = this.props
    if (this._color !== color || this._manager !== manager) {
      this._color = color
      this._manager = manager
      this._backgrounds = []
    }
    if (this._maxSize !== manager.fullSize) {
      this._backgrounds.pop()
      this._maxIndex = Math.trunc(manager.fullSize / MAX_CANVAS_SIZE)
      this._maxSize = manager.fullSize
    }
    const startIndex = Math.trunc(startPixel / MAX_CANVAS_SIZE)
    const endIndex = Math.trunc(endPixel / MAX_CANVAS_SIZE)

    const isHorizontal = type === BackgroundType.Horizontal

    const backgrounds = []

    for (let index = startIndex; index <= endIndex; index++) {
      const pixel = MAX_CANVAS_SIZE * index
      const size = Math.min(this._maxSize, MAX_CANVAS_SIZE * (index + 1)) - pixel
      if (!this._backgrounds[index]) {
        const canvas = document.createElement('canvas')
        canvas.height = isHorizontal ? size : 1
        canvas.width = !isHorizontal ? size : 1
        const context = canvas.getContext('2d')
        context.fillStyle = color
        const startIndex = manager.getIndexByPixel(pixel)
        const endIndex = manager.getIndexByPixel(pixel + size)
        for (let index = startIndex + 1; index <= endIndex; index++) {
          const position = manager.getPixelByIndex(index) - pixel - 1
          isHorizontal ? context.fillRect(0, position, 1, 1) : context.fillRect(position, 0, 1, 1)
        }
        
        this._backgrounds[index] = canvas.toDataURL()
        canvas.remove()
      }

      backgrounds.push({
        position: 'absolute',
        top: !isHorizontal ? 0 : pixel,
        height: !isHorizontal ? '100%' : size,
        left: isHorizontal ? 0 : pixel,
        width: isHorizontal ? '100%' : size,
        background: `url(${this._backgrounds[index]})`
      })
    }
    return backgrounds
  }

  render () {
    const { type } = this.props
    return this.getBackgrounds().map((style) => (
      <div
        key={type === BackgroundType.Vertical ? `${style.left}-${style.width}` : `${style.top}-${style.height}`}
        className={type}
        style={style}
      />
    ))
  }
}
