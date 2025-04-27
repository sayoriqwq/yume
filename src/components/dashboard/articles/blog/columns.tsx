'use client'

import type { Article, Category, Tag } from '@/generated'
import type { ColumnDef } from '@tanstack/react-table'
import { baseSelector } from '../../table/base-columns'
import { DataTableColumnHeader } from '../../table/DataTableColumnHeader'

export type Blog = Partial<Article> & {
  category?: Category | null
  tags?: Tag[]
}

export const columns: ColumnDef<Blog>[] = [
  baseSelector<Blog>(),
  {
    header: 'ID',
    accessorKey: 'id',
  },
  {
    header: '标题',
    accessorKey: 'title',
  },
  {
    header: 'Slug',
    accessorKey: 'slug',
  },
  {
    header: '描述',
    accessorKey: 'description',
  },
  {
    header: '封面',
    accessorKey: 'cover',
  },
  {
    header: '浏览量',
    accessorKey: 'viewCount',
  },
  {
    header: 'MDX路径',
    accessorKey: 'mdxPath',
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
//   baseActions<Blog>(),
]
