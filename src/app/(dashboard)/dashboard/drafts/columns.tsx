'use client'

import type { Draft } from '@/types/article'
import type { ColumnDef } from '@tanstack/react-table'
import { baseActions, baseSelector } from '@/components/dashboard/table/base-columns'
import { DataTableCellWithEdit } from '@/components/dashboard/table/DataTableCellWithEdit'

import { DataTableCellWithTooltip } from '@/components/dashboard/table/DataTableCellWithTooltip'
import { DataTableColumnHeader } from '@/components/dashboard/table/DataTableColumnHeader'
import Image from 'next/image'

export function getColumns(actions: {
  onDelete: (id: number) => void
  onEdit: (row: Draft) => void
}): ColumnDef<Draft>[] {
  return [
    baseSelector<Draft>(),
    {
      header: 'ID',
      accessorKey: 'id',
      size: 80,
    },
    {
      header: '标题',
      accessorKey: 'title',
      cell: ({ row }) => {
        const title = row.original.title || ''
        const id = row.original.id || 0
        return (
          <DataTableCellWithEdit
            fieldName="title"
            initialValue={title}
            id={id}
            onSave={(id, updates) => {
              const draft = { id, ...updates } as Draft
              actions.onEdit(draft)
            }}
          />
        )
      },
    },
    {
      header: 'Slug',
      accessorKey: 'slug',
      cell: ({ row }) => {
        const slug = row.original.slug || ''
        const id = row.original.id || 0
        return (
          <DataTableCellWithEdit
            fieldName="slug"
            initialValue={slug}
            id={id}
            onSave={(id, updates) => {
              const draft = { id, ...updates } as Draft
              actions.onEdit(draft)
            }}
          />
        )
      },
    },
    {
      header: '描述',
      accessorKey: 'description',
      size: 200,
      cell: ({ row }) => {
        return <DataTableCellWithTooltip text={row.original.description} />
      },
    },
    {
      header: '封面',
      accessorKey: 'cover',
      cell: ({ row }) => {
        const cover = row.original.cover
        return <div>{cover ? <Image src={cover} alt="封面" width={100} height={100} /> : '无封面'}</div>
      },
    },
    {
      header: '浏览量',
      accessorKey: 'viewCount',
    },
    {
      header: '分类',
      accessorKey: 'category',
      cell: ({ row }) => {
        const category = row.original.category
        return <div>{category?.name}</div>
      },
    },
    {
      header: '标签',
      accessorKey: 'tags',
      cell: ({ row }) => {
        const tags = row.original.tags
        return (
          <div className="flex gap-1">
            {tags?.map(tag => (
              <span key={tag.id} className="px-2 py-1 bg-secondary rounded-md text-sm">
                {tag.name}
              </span>
            ))}
          </div>
        )
      },
    },
    {
      header: '发布状态',
      accessorKey: 'published',
      cell: ({ row }) => {
        const published = row.original.published
        return (
          <div className={published ? 'text-green-500' : 'text-red-500'}>
            {published ? '已发布' : '未发布'}
          </div>
        )
      },
    },
    {
      header: ({ column }) => {
        return (
          <DataTableColumnHeader column={column} title="创建时间" />
        )
      },
      accessorKey: 'createdAt',
      cell: ({ row }) => {
        return new Date(row.original.createdAt!).toLocaleString()
      },
    },
    {
      header: ({ column }) => {
        return (
          <DataTableColumnHeader column={column} title="更新时间" />
        )
      },
      accessorKey: 'updatedAt',
      cell: ({ row }) => {
        return new Date(row.original.updatedAt!).toLocaleString()
      },
    },
    baseActions<Draft>(actions),
  ]
}
