import { UIEvent } from 'react';

type OnScrollType = (props: {
  scrollLeft: number;
  scrollTop: number;
  event?: UIEvent<Element>
}) => void

export default OnScrollType