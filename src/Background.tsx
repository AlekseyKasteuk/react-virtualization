import * as React from 'react'

import { Range } from './RenderRangersManager'
import SizeAndPositionManager from './SizeAndPositionManager'

export interface BackgroundProps {
  enableBackgroundVerticalLines?: boolean,
  enableBackgroundHorizontalLines?: boolean,
  rowManager?: SizeAndPositionManager,
  columnManager?: SizeAndPositionManager,
  rowsRange: Range,
  columnsRange: Range,
}

export default class Background extends React.PureComponent<BackgroundProps> {
  render () {
    return (<div></div>)
  }
}
