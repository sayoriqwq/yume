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
import { useModalStack } from 'rc-modal-sheet'
import { useCallback, useEffect } from 'react'

interface DataTableRowActionsProps<TData extends { id: number }> {
  row: Row<TData>
  actions?: {
    onDelete?: (id: number) => void
    onEdit?: (row: TData) => void
  }
}

export function DataTableRowActions<TData extends { id: number }>({
  row,
  actions,
}: DataTableRowActionsProps<TData>) {
  const { present, dismiss } = useModalStack()
  const onDelete = actions?.onDelete
  const onEdit = actions?.onEdit
  const openDeleteModal = useCallback(() => {
    const modalId = `delete-${row.original.id}`
    console.log('openDeleteModal', row)
    present({
      title: '确定删除吗？',
      id: modalId,
      content: () => {
        return (
          <div className="flex-between">
            <Button
              variant="destructive"
              onClick={() => {
                onDelete?.(row.original.id)
                dismiss(modalId)
              }}
            >
              确定
            </Button>
            <Button variant="outline" onClick={() => dismiss(modalId)}>取消</Button>
          </div>
        )
      },
    })
  }, [present, dismiss, onDelete, row])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 'Delete' && onDelete) {
        e.preventDefault()
        openDeleteModal()
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
  }, [row, onDelete, onEdit, openDeleteModal])

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
        <DropdownMenuItem onClick={() => {
          onEdit?.(row.original)
        }}
        >
          编辑
          <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={openDeleteModal}
          className="text-destructive-foreground"
        >
          删除
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
