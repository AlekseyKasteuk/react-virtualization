import * as React from 'react'

import { SelectedCellType, SetSelectedCellType } from '../types'

interface SelectedCellContextParams {
  selectedCell?: SelectedCellType;
}

export default React.createContext<SelectedCellContextParams>({
  selectedCell: null,
})