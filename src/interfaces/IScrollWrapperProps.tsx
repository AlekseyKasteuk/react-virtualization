import SizeAndPositionManager from '../managers/SizeAndPositionManager'

export default interface IScrollWrapperProps {
  width: number;
  height: number;
  fullWidth: number;
  fullHeight: number;
  scrollTop: number;
  scrollLeft: number;
  onScroll: (event: React.UIEvent) => void;
  children: React.ReactNode;
}
