import OnOffsetAdjustmentChangeType from '../types/OnOffsetAdjustmentChangeType'
import OnScrollType from '../types/OnScrollType'

export default interface IGridWrapperProps {
  id?: string;
  className?: string;
  width: number;
  height: number;
  contentWidth: number;
  contentHeight: number;
  scrollTop: number;
  scrollLeft: number;
  onScroll: OnScrollType;
  children: React.ReactNode;
  hideScrollbars?: boolean;
  onOffsetAdjustmentChange?: OnOffsetAdjustmentChangeType;
}
