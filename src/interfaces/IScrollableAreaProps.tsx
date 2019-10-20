import SizeAndPositionManager from '../managers/SizeAndPositionManager'

export default interface IScrollableAreaProps {
  width: number;
  height: number;
  fullWidth: number;
  fullHeight: number;
  scrollTop: number;
  scrollLeft: number;
  onScroll: ({ scrollTop, scrollLeft }: { scrollTop: number, scrollLeft: number }) => void;
  children: React.ReactElement;
}
