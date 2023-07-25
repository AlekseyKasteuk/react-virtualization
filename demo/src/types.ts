type SelectedCellType = { rowIndex: number, columnIndex: number } | null
type SetSelectedCellType = (props: SelectedCellType) => void

export { SelectedCellType, SetSelectedCellType }