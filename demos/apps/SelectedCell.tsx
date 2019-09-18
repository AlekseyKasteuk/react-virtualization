import * as React from 'react'

import SelectedCellContext from './SelectedCellContext'

import { SelectedCellType } from '../types'
import { RangeRendererParamsType } from '../../src/types'

interface ISelectedCellProps extends RangeRendererParamsType {
  selectedCell: SelectedCellType;
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
    const { getStyle, selectedCell: { rowIndex, columnIndex }, rowManager, columnManager } = this.props
    return (
      <div
        ref={this.ref}
        style={{
          ...getStyle({ rowIndex, columnIndex }),
          width: `${columnManager.getSize(columnIndex) + 1}px`,
          height: `${rowManager.getSize(rowIndex) + 1}px`,
          border: '1px solid red',
          outline: 'none',
          boxSizing: 'border-box',
        }}
        tabIndex={0}
      />
    )
  }
}

export default (props: RangeRendererParamsType) => (
  <SelectedCellContext.Consumer>
      {
        ({ selectedCell }) => selectedCell && (<SelectedCell {...props} selectedCell={selectedCell} />)
      }
    </SelectedCellContext.Consumer>
)