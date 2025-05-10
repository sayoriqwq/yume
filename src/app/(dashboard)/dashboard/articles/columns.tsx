'use client'

import type { NormalizedArticle } from '@/atoms/dashboard/types'
import type { Article } from '@/generated'

import type { ColumnDef } from '@tanstack/react-table'
import type { DataTableRowAction } from './page'
import { useCategoriesData } from '@/atoms/dashboard/hooks/useCategory'
import { useTagsData } from '@/atoms/dashboard/hooks/useTag'
import { baseActions, baseSelector } from '@/components/dashboard/table/base-columns'
import { DataTableCellWithEdit } from '@/components/dashboard/table/DataTableCellWithEdit'
import { DataTableCellWithSwitch } from '@/components/dashboard/table/DataTableCellWithSwitch'
import { DataTableColumnHeader } from '@/components/dashboard/table/DataTableColumnHeader'
import { DataTableFacetedFilter } from '@/components/dashboard/table/DataTableFacetedFilter'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Eye, FileEdit, FileText, MessageSquare, ThumbsUp } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const articleTypeOptions = [
  {
    label: '博客',
    value: 'BLOG',
    icon: FileText,
  },
  {
    label: '随记',
    value: 'NOTE',
    icon: BookOpen,
  },
  {
    label: '草稿',
    value: 'DRAFT',
    icon: FileEdit,
  },
]

function CategoryCell({ categoryId }: { categoryId: number }) {
  const { categoryMap } = useCategoriesData()
  return <div>{categoryMap[categoryId].name}</div>
}

function TagCell({ tagIds }: { tagIds: number[] | undefined }) {
  const { tagMap } = useTagsData()
  if (!tagIds || tagIds.length === 0)
    return <div>无标签</div>
  return <div className="flex flex-wrap">{tagIds.map(tagId => tagMap[tagId].name).join(', ')}</div>
}

interface ColumnsProps {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<Article> | null>>
}

export function useColumns({ setRowAction }: ColumnsProps): ColumnDef<NormalizedArticle>[] {
  const router = useRouter()
  return [
    baseSelector<NormalizedArticle>(),
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
            customValueWrapper={(value) => {
              return (
                <div className="max-w-[200px] text-wrap">{value}</div>
              )
            }}
          />
        )
      },
    },
    {
      header: ({ column }) => {
        return (
          <DataTableFacetedFilter column={column} title="类型" options={articleTypeOptions} />
        )
      },
      accessorKey: 'type',
      size: 80,
      // 添加筛选功能
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      cell: ({ row }) => {
        const type = row.original.type
        return (
          <Badge variant="outline">
            {type}
          </Badge>
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
        return <TagCell tagIds={row.original?.tagIds} />
      },
      size: 150,
    },
    {
      header: '随记 meta',
      id: 'note-meta',
      size: 150,
      cell: ({ row }) => {
        const { mood, weather, location } = row.original
        if (!mood && !weather && !location)
          return <div>无数据</div>

        return (
          <div className="text-xs space-y-1">
            {mood && (
              <div>
                <span className="font-medium">心情:</span>
                {' '}
                {mood}
              </div>
            )}
            {weather && (
              <div>
                <span className="font-medium">天气:</span>
                {' '}
                {weather}
              </div>
            )}
            {location && (
              <div>
                <span className="font-medium">位置:</span>
                {' '}
                {location}
              </div>
            )}
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
      header: '统计信息',
      id: 'stats',
      size: 120,
      cell: ({ row }) => {
        const article = row.original
        return (
          <div className="flex gap-2 items-center">
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {article.viewCount}
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              {article?.commentIds?.length}
            </div>
            <div className="flex items-center">
              <ThumbsUp className="h-4 w-4 mr-1" />
              {article?.likeCount || 0}
            </div>
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
    baseActions<NormalizedArticle>({
      onDelete: (id) => {
        setRowAction({ type: 'delete', id })
      },
      onEdit: (row) => {
        router.push(`/dashboard/articles/${row.id}`)
      },
    }),
  ]
}
