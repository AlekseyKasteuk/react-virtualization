import Grid from './Grid'

import IHorizontalListProps from "./interfaces/IHorizontalListProps"

export default class HorizontalList extends Grid {
  constructor (props: IHorizontalListProps) {
    super({
      ...props,
      enableBackgroundHorizontalLines: false,
      rowCount: 1,
      rowHeight: props.height,
      overscanRowCount: 0,
    })
  }
}
