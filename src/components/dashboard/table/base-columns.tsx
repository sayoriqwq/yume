import type { ColumnDef, Row } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableRowActions } from './DataTableRowActions'

export interface Action<T extends { id: number }> {
  onDelete?: (id: number) => void
  onEdit?: (row: T) => void
}

export function baseSelector<T extends object>(): ColumnDef<T> {
  return {
    id: 'select',
    size: 30,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
          || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }
}

export function baseActions<T extends { id: number }>(
  actions: Action<T>,
): ColumnDef<T> {
  return {
    id: 'actions',
    header: '操作',
    cell: ({ row }) => {
      return (
        <DataTableRowActions<T>
          row={row as Row<T>}
          actions={actions}
        />
      )
    },
  }
}
