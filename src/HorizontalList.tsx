import Grid from './Grid'

import { HorizontalListProps } from './types'

export default class HorizontalList extends Grid {
  constructor (props: HorizontalListProps) {
    super({
      ...props,
      enableBackgroundHorizontalLines: false,
      rowCount: 1,
      rowHeight: props.height,
      overscanRowCount: 0,
    })
  }
}
