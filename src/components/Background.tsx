import * as React from 'react'

import SizeAndPositionManager from '../managers/SizeAndPositionManager'

const MAX_CANVAS_SIZE = 8000;

type BackgroundResult = {
  index: number;
  position: number;
  size: number;
  image: React.CSSProperties['backgroundImage'];
}

interface CreateBackgroundProps {
  isHorizontal: boolean;
  manager: SizeAndPositionManager;
  startIndex: number,
  endIndex: number,
  size: number,
  getBorderColor: (index: number) => string | undefined;
  getBackgroundColor: (index: number) => string | undefined;
}

const createBackground = (props: CreateBackgroundProps): string => {
  const {
    isHorizontal,
    manager,
    startIndex,
    endIndex,
    size,
    getBorderColor,
    getBackgroundColor,
  } = props;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.height = isHorizontal ? size : 1;
  canvas.width = isHorizontal ? 1 : size;
  const fillRect = (color: CanvasRenderingContext2D['fillStyle'], position: number, size: number) => {
    if (isHorizontal) {
      context.fillStyle = color;
      context.fillRect(0, position, 1, size)
    } else {
      context.fillRect(position, 0, size, 1)
    }
  }
  for (let index = startIndex; index <= endIndex; index++) {
    const backgroundColor = getBackgroundColor(index);
    const borderColor = getBorderColor(index);
    if (!backgroundColor && !borderColor) {
      continue;
    }
    const currentEndOffset = manager.getEndOffset(index);
    if (backgroundColor) {
      const currentStartOffset = manager.getOffset(index);
      const currentSize = currentEndOffset - currentStartOffset - 2;
      if (currentSize > 0) {
        context.fillStyle = backgroundColor;
        fillRect(backgroundColor, currentStartOffset + 1, currentSize);
      }
    }
    if (borderColor) {
      fillRect(borderColor, currentEndOffset, 1);
    }
  }
  const image = canvas.toDataURL()
  canvas.remove()
  return image
}

type CreateBackgroundCacheProps = {
  manager: SizeAndPositionManager;
  startIndex: number;
  endIndex: number;
  isHorizontal: boolean;
  borderColor?: string;
  getBorderColor?: (index: number) => string;
  backgroundColor?: string;
  getBackgroundColor?: (index: number) => string;
}

export const createBackgroundGetter = (props: CreateBackgroundCacheProps) => {
  const {
    manager,
    isHorizontal,
    startIndex = 0,
    endIndex = manager.count - 1,
    borderColor,
    getBorderColor = () => borderColor,
    backgroundColor,
    getBackgroundColor = () => backgroundColor,
  } = props;

  const initialStartOffset = manager.getOffset(startIndex);
  const initialEndOffset = manager.getEndOffset(endIndex);

  const cache = {};
  return (renderStartIndex: number, renderEndIndex: number): BackgroundResult[] => {
    const backgrounds = [];
    if (renderStartIndex <= endIndex && renderEndIndex >= startIndex) {
      const startOffset = manager.getOffset(Math.max(renderStartIndex, startIndex));
      const startBackgroundIndex = Math.floor(startOffset / MAX_CANVAS_SIZE);

      const endOffset = manager.getEndOffset(Math.min(renderEndIndex, endIndex)) - 1;
      const endBackgroundIndex = Math.floor(endOffset / MAX_CANVAS_SIZE);

      for (let index = startBackgroundIndex; index <= endBackgroundIndex; index++) {
        const position = index * MAX_CANVAS_SIZE + initialStartOffset;
        const size = MAX_CANVAS_SIZE + Math.min(0, initialEndOffset - (position + MAX_CANVAS_SIZE))
        if (!(index in cache)) {
          const startIndex = manager.getIndex(position);
          const endIndex = manager.getIndex(position + size);
          cache[index] = createBackground({
            isHorizontal,
            manager,
            startIndex,
            endIndex,
            size,
            getBorderColor,
            getBackgroundColor
          })
        }
        backgrounds.push({ index, position, size: size, image: cache[index] });
      }
    }
    return backgrounds;
  }
}

interface BackgroundProps extends CreateBackgroundCacheProps {
  renderStartIndex: number,
  renderEndIndex: number,
}

export const useBackgrounds = (props: BackgroundProps): BackgroundResult[] => {
  const { renderStartIndex, renderEndIndex, ...rest } = props;
  const { manager, startIndex, endIndex, isHorizontal, borderColor, getBorderColor, backgroundColor, getBackgroundColor } = rest;
  const backgroundGetter = React.useMemo(
    () => createBackgroundGetter(rest),
    [manager, startIndex, endIndex, isHorizontal, borderColor, getBorderColor, backgroundColor, getBackgroundColor]
  );

  return backgroundGetter(renderStartIndex, renderEndIndex);
}

const Background: React.FC<BackgroundProps> = (props) => {
  const backgrounds = useBackgrounds(props)
  const { isHorizontal } = props;
  return (
    <>{backgrounds.map(({ index, position, size, image }) => {
      const style: React.CSSProperties = {
        position: 'absolute',
        backgroundImage: `url(${image})`,
      }
      if (isHorizontal) {
        style.top = position;
        style.width = isFinite(size) ? size : '100%';
      } else {

      }
      return (<div key={index} style={{}} />)
    })}</>
  );
}

export default React.memo(Background);
