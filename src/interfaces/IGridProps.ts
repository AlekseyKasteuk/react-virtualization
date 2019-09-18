import IHorizontalListProps from './IHorizontalListProps'
import IVerticalListProps from './IVerticalListProps'

export default interface IGridProps extends IHorizontalListProps, IVerticalListProps {
  overscanRowCount?: number;
  overscanColumnCount?: number;
  enableBackgroundVerticalLines?: boolean;
  enableBackgroundHorizontalLines?: boolean;
  verticalBackgroundLinesColor?: string;
  horizontalBackgroundLinesColor?: string;
}
