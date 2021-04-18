import * as React from 'react'
import { SizeAndPositionManager } from 'react-virtualization'

import SelectedCellContext from './SelectedCellContext'

import { SelectedCellType } from '../types'

interface ISelectedCellProps {
  selectedCell: SelectedCellType;
  rowSizeAndPositionManager: SizeAndPositionManager;
  columnSizeAndPositionManager: SizeAndPositionManager;
}

class SelectedCell extends React.PureComponent<ISelectedCellProps> {
  ref: React.RefObject<HTMLDivElement> = React.createRef()
  
  componentDidMount() {
    this.ref.current && this.ref.current.focus()
  }

  componentDidUpdate() {
    this.ref.current && this.ref.current.focus()
  }

  render() {
    const { selectedCell: { rowIndex, columnIndex }, rowSizeAndPositionManager, columnSizeAndPositionManager } = this.props
    return (
      <div
        ref={this.ref}
        style={{
          position: 'absolute',
          top: rowSizeAndPositionManager.getPixelByIndex(rowIndex),
          left: columnSizeAndPositionManager.getPixelByIndex(columnIndex),
          width: columnSizeAndPositionManager.getSize(columnIndex) + 1,
          height: rowSizeAndPositionManager.getSize(rowIndex) + 1,
          border: '1px solid red',
          outline: 'none',
          boxSizing: 'border-box',
        }}
        tabIndex={0}
      />
    )
  }
}

export default (props: any) => (
  <SelectedCellContext.Consumer>
      {
        ({ selectedCell }) => selectedCell && (<SelectedCell {...props} selectedCell={selectedCell} />)
      }
    </SelectedCellContext.Consumer>
)