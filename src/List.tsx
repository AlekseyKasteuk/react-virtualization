import Grid from './Grid'

import { VerticalListProps } from './types'

export default class List extends Grid {
  constructor (props: VerticalListProps) {
    super({
      ...props,
      enableBackgroundVerticalLines: false,
      columnCount: 1,
      columnWidth: props.width,
      overscanColumnCount: 0,
    })
  }
}
