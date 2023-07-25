import { UIEvent } from 'react';

type OnScrollType = (props: {
  scrollLeft: number;
  scrollTop: number;
  event?: UIEvent<Element>,
  isUserAction: boolean
}) => void

export default OnScrollType