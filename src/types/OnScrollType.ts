import { SyntheticEvent } from 'react'

type OnScrollType = (props: {
  scrollLeft?: number;
  scrollTop?: number;
}, event?: SyntheticEvent) => void

export default OnScrollType