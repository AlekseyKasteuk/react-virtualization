import SizeAndPositionManager from '../managers/SizeAndPositionManager'
import OnScrollType from '../types/OnScrollType'

export default interface IScrollableAreaProps {
  width: number;
  height: number;
  fullWidth: number;
  fullHeight: number;
  scrollTop: number;
  scrollLeft: number;
  scrollbarSize?: number;
  scrollbarColor?: number;
  onScroll: OnScrollType;
  children: React.ReactNode;
}
