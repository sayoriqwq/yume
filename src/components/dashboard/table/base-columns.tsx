import type { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableRowActions } from './DataTableRowActions'

export interface TableMeta<TData extends object> {
  onDelete?: (row: TData) => void
  onEdit?: (row: TData) => void
}

export function baseSelector<T extends object>(): ColumnDef<T> {
  return {
    id: 'select',
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

export function baseActions<T extends object>(): ColumnDef<T> {
  return {
    id: 'actions',
    header: '操作',
    cell: ({ row, table }) => (
      <DataTableRowActions
        row={row}
        onDelete={(row) => {
          const meta = table.options.meta as TableMeta<T>
          meta.onDelete?.(row)
        }}
        onEdit={(row) => {
          const meta = table.options.meta as TableMeta<T>
          meta?.onEdit?.(row)
        }}
      />
    ),
  }
}
