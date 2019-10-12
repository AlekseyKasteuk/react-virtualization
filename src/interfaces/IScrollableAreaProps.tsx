import SizeAndPositionManager from '../managers/SizeAndPositionManager'

export default interface IScrollableAreaProps {
  width: number;
  height: number;
  fullWidth: number;
  fullHeight: number;
  scrollTop: number;
  scrollLeft: number;
  onScroll: (event: React.UIEvent) => void;
  children: React.ReactElement;
}
