'use client'

import type { Row } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { useEffect } from 'react'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  onDelete?: (row: TData) => void
  onEdit?: (row: TData) => void
}

export function DataTableRowActions<TData>({
  row,
  onDelete,
  onEdit,
}: DataTableRowActionsProps<TData>) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 'Delete' && onDelete) {
        e.preventDefault()
        onDelete(row.original)
      }
      if (e.metaKey && e.key === 'e' && onEdit) {
        e.preventDefault()
        onEdit(row.original)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [row, onDelete, onEdit])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal />
          <span className="sr-only">打开菜单</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={() => onEdit?.(row.original)}>
          编辑
          <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => onDelete?.(row.original)}
          className="text-destructive-foreground"
        >
          删除
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
