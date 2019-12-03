import SizeAndPositionManager from '../managers/SizeAndPositionManager'

export default interface IGridWrapperProps {
  className?: string;
  width: number;
  height: number;
  contentWidth: number;
  contentHeight: number;
  scrollTop: number;
  scrollLeft: number;
  onScroll: ({ scrollTop, scrollLeft }: { scrollTop: number, scrollLeft: number }) => void;
  children: React.ReactElement;
  hideScrollbars?: boolean;
}
