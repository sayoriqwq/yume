'use client'

import type {
  Column,
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useCallback, useState } from 'react'
import { DataTablePagination } from './DataTablePagination'
import { DataTableToolbar } from './DataTableToolBar'
import { DataTableViewOptions } from './DataTableViewOptions'

interface BaseDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterKey?: string
}

const tableCellBaseStyles = 'bg-background'
const tableCellPinnedStyles = {
  left: 'sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]',
  right: 'sticky right-0 z-10 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]',
} as const

export function BaseDataTable<TData, TValue>({
  columns,
  data,
  filterKey,
}: BaseDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: ['select'],
    right: ['actions'],
  })

  const getPinStyles = useCallback((column: Column<TData, unknown>) => {
    const isPinned = column.getIsPinned()
    const pinClassName = isPinned ? tableCellPinnedStyles[isPinned] : ''
    const width = column.getSize()
    return { pinClassName, width }
  }, [])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      columnPinning,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div>
      <div className="flex items-center py-4">
        {
          filterKey && <DataTableToolbar table={table} filterKey={filterKey} />
        }
        <DataTableViewOptions table={table} />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const { pinClassName, width } = getPinStyles(header.column)
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(pinClassName, tableCellBaseStyles)}
                      style={{ width }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length
              ? (
                  table.getRowModel().rows.map(row => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      className="cursor-pointer"
                      onClick={() => row.toggleSelected(!row.getIsSelected())}
                    >
                      {row.getVisibleCells().map((cell) => {
                        const { pinClassName, width } = getPinStyles(cell.column)
                        return (
                          <TableCell
                            key={cell.id}
                            className={cn(pinClassName, tableCellBaseStyles)}
                            style={{ width }}
                            onClick={(e) => {
                              // 如果点击的是操作列，不触发行选择
                              if (cell.column.id === 'actions') {
                                e.stopPropagation()
                              }
                            }}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  ))
                )
              : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      没有结果
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}
