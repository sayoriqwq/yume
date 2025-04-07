'use client'

import type { Article } from '@/atoms/dashboard/types'
import type { ColumnDef } from '@tanstack/react-table'
import type { DataTableRowAction } from './page'

import { useArticleDetail } from '@/atoms/dashboard/hooks/useArticle'
import { useCategoriesData } from '@/atoms/dashboard/hooks/useCategory'
import { useTagsData } from '@/atoms/dashboard/hooks/useTag'
import { baseActions, baseSelector } from '@/components/dashboard/table/base-columns'
import { DataTableCellWithEdit } from '@/components/dashboard/table/DataTableCellWithEdit'
import { DataTableCellWithSwitch } from '@/components/dashboard/table/DataTableCellWithSwitch'
import { DataTableColumnHeader } from '@/components/dashboard/table/DataTableColumnHeader'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

function CategoryCell({ categoryId }: { categoryId: number }) {
  const { categoryMap } = useCategoriesData()
  return <div>{categoryMap[categoryId].name}</div>
}

function TagCell({ articleId }: { articleId: number }) {
  const { tagMap } = useTagsData()
  const { articleIdToTagIdsMap } = useArticleDetail(articleId)
  const tagIds = articleIdToTagIdsMap[articleId]
  return <div>{tagIds.map(tagId => tagMap[tagId].name).join(', ')}</div>
}

interface ColumnsProps {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<Article> | null>>
}

export function useColumns({ setRowAction }: ColumnsProps): ColumnDef<Article>[] {
  const router = useRouter()
  return [
    baseSelector<Article>(),
    {
      header: ({ column }) => {
        return (
          <DataTableColumnHeader column={column} title="ID" />
        )
      },
      accessorKey: 'id',
      size: 80,
    },
    {
      header: '标题',
      accessorKey: 'title',
      cell: ({ row }) => {
        const title = row.original.title || ''
        return (
          <DataTableCellWithEdit
            getValue={() => title}
            onSave={(value) => {
              const article = { ...row.original } as Article
              setRowAction({ type: 'edit', id: article.id, updates: { title: value } })
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
        return (
          <DataTableCellWithEdit
            getValue={() => row.original.description || ''}
            modal={{ fieldName: 'description' }}
            customValueWrapper={(value) => {
              return (
                <div className="max-w-[200px] text-wrap line-clamp-2 text-sm">
                  {value}
                </div>
              )
            }}
            onSave={(value) => {
              const article = { ...row.original } as Article
              setRowAction({ type: 'edit', id: article.id, updates: { description: value } })
            }}
          />
        )
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
        return <CategoryCell categoryId={row.original.categoryId} />
      },
    },
    {
      header: '标签',
      accessorKey: 'tags',
      cell: ({ row }) => {
        return <TagCell articleId={row.original.id} />
      },
    },
    {
      header: '发布状态',
      accessorKey: 'published',
      cell: ({ row }) => {
        const published = row.original.published
        return (
          <DataTableCellWithSwitch
            checked={published}
            onCheckedChange={(checked) => {
              const article = { ...row.original } as Article
              setRowAction({ type: 'edit', id: article.id, updates: { published: checked } })
            }}
            enabledText="已发布"
            disabledText="未发布"
          />
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
    baseActions<Article>({
      onDelete: (id) => {
        setRowAction({ type: 'delete', id })
      },
      onEdit: (row) => {
        router.push(`/dashboard/articles/${row.id}`)
      },
    }),
  ]
}
