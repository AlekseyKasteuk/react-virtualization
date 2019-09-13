import Grid from './Grid'

import IVerticalListProps from "./interfaces/IVerticalListProps"

export default class List extends Grid {
  constructor (props: IVerticalListProps) {
    super({
      ...props,
      enableBackgroundVerticalLines: false,
      columnCount: 1,
      columnWidth: props.width,
      overscanColumnCount: 0,
    })
  }
}
