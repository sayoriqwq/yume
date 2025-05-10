'use client'

import type { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filterKey: string
}

export function DataTableToolbar<TData>({
  table,
  filterKey,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={`按 ${filterKey} 搜索...`}
          value={(table.getColumn(filterKey)?.getFilterValue() as string) ?? ''}
          onChange={event =>
            table.getColumn(filterKey)?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {/* {table.getColumn('published') && (
          <DataTableFacetedFilter
            column={table.getColumn('published')}
            title="发布状态"
            options={publishedStatus}
          />
        )} */}
        {/* {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={priorities}
          />
        )} */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            重置
            <X />
          </Button>
        )}
      </div>
    </div>
  )
}
