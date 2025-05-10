'use client'

import type { NormalizedComment } from '@/atoms/dashboard/types'
import type { ApprovalStatus, Comment } from '@/generated'
import type { ColumnDef } from '@tanstack/react-table'
import type { DataTableRowAction } from './page'
import { useArticlesData } from '@/atoms/dashboard/hooks/useArticle'
import { useCategoriesData } from '@/atoms/dashboard/hooks/useCategory'
import { NormalTime, RelativeTime } from '@/components/common/time'
import { baseSelector } from '@/components/dashboard/table/base-columns'
import { DataTableColumnHeader } from '@/components/dashboard/table/DataTableColumnHeader'
import { DataTableFacetedFilter } from '@/components/dashboard/table/DataTableFacetedFilter'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlarmClock, ArrowUpCircle, Check, ExternalLink, MessageCircle, Trash2, X } from 'lucide-react'
import Link from 'next/link'

const statusOptions = [
  {
    label: '待审核',
    value: 'PENDING',
    icon: AlarmClock,
  },
  {
    label: '已批准',
    value: 'APPROVED',
    icon: Check,
  },
  {
    label: '已拒绝',
    value: 'REJECTED',
    icon: X,
  },
]

function StatusBadge({ status }: { status: ApprovalStatus }) {
  switch (status) {
    case 'PENDING':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">待审核</Badge>
    case 'APPROVED':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">已批准</Badge>
    case 'REJECTED':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">已拒绝</Badge>
    default:
      return null
  }
}

// 评论类型 (是否为回复)
function TypeBadge({ parentId }: { parentId?: number | null }) {
  return parentId
    ? <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">回复</Badge>
    : <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">评论</Badge>
}

interface ColumnsProps {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<Comment> | null>>
  showCommentDetail: (id: number) => void
}

function ArticleCell({ articleId }: { articleId: number }) {
  const { articleMap } = useArticlesData()
  const { categoryMap } = useCategoriesData()
  const article = articleMap[articleId]
  const category = categoryMap[article?.categoryId]
  if (!article)
    return <span className="text-muted-foreground italic">无关联文章</span>

  return (
    <div className="flex items-center gap-1">
      <Link href={`/dashboard/articles/${article.id}`} className="hover:underline truncate max-w-[200px]">
        {article.title}
      </Link>
      <Button variant="ghost" size="icon" className="h-5 w-5" asChild>
        <Link href={`/posts/${category.name}/${article.slug}`} target="_blank">
          <ExternalLink className="h-3 w-3" />
        </Link>
      </Button>
    </div>
  )
}

export function useColumns({ setRowAction, showCommentDetail }: ColumnsProps): ColumnDef<NormalizedComment>[] {
  return [
    baseSelector<NormalizedComment>(),
    {
      id: 'id',
      accessorKey: 'id',
      header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
      size: 80,
    },
    {
      id: 'content',
      accessorKey: 'content',
      header: ({ column }) => <DataTableColumnHeader column={column} title="内容" />,
      cell: ({ row }) => {
        const isDeleted = row.original.deleted
        if (isDeleted) {
          return <span className="text-muted-foreground italic">此评论已被删除</span>
        }

        return (
          <div
            className="max-w-[400px] truncate cursor-pointer hover:text-primary"
            onClick={() => showCommentDetail(row.original.id)}
          >
            {row.original.content}
          </div>
        )
      },
      size: 300,
    },
    {
      id: 'type',
      header: '类型',
      cell: ({ row }) => <TypeBadge parentId={row.original.parentId} />,
      size: 80,
    },
    {
      id: 'author',
      header: '作者',
      cell: ({ row }) => {
        const author = row.original.author
        if (!author)
          return <span className="text-muted-foreground italic">无作者</span>

        return (
          <div className="flex items-center gap-2">
            <Avatar className="size-8">
              <AvatarImage src={author.image_url || ''} alt={author.username || '匿名'} />
              <AvatarFallback>{(author.username?.[0] || '?').toUpperCase()}</AvatarFallback>
            </Avatar>
            <span>{author.username}</span>
          </div>
        )
      },
      size: 150,
    },
    {
      id: 'article',
      header: '所属文章',
      cell: ({ row }) => {
        return <ArticleCell articleId={row.original.articleId} />
      },
      size: 200,
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableFacetedFilter
          column={column}
          title="状态"
          options={statusOptions}
        />
      ),
      cell: ({ row }) => <StatusBadge status={row.original.status as ApprovalStatus} />,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      size: 100,
    },
    {
      id: 'replies',
      header: '回复',
      cell: ({ row }) => {
        const replies = row.original.replyIds?.length || 0

        return replies > 0
          ? (
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-primary"
                onClick={() => showCommentDetail(row.original.id)}
              >
                <MessageCircle className="h-4 w-4" />
                <span className="hover:underline">{replies}</span>
              </div>
            )
          : <span className="text-muted-foreground">无回复</span>
      },
      size: 80,
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title="创建时间" />,
      cell: ({ row }) => (
        <div className="flex flex-col text-xs">
          <div className="text-muted-foreground">
            <RelativeTime date={row.original.createdAt} />
          </div>
          <NormalTime date={row.original.createdAt} className="text-muted-foreground" />
        </div>
      ),
      size: 120,
    },
    {
      id: 'actions',
      header: '操作',
      cell: ({ row }) => {
        const isDeleted = row.original.deleted
        return (
          <div className="flex items-center gap-1">
            {isDeleted
              ? (
            // 已删除评论显示恢复按钮
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => {
                      setRowAction({
                        type: 'edit',
                        id: row.original.id,
                        updates: { deleted: false },
                      })
                    }}
                  >
                    <ArrowUpCircle className="h-4 w-4 mr-1" />
                    <span className="text-xs">恢复</span>
                  </Button>
                )
              : (
            // 未删除评论显示状态操作
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => {
                        setRowAction({
                          type: 'edit',
                          id: row.original.id,
                          updates: { status: 'APPROVED' as ApprovalStatus },
                        })
                      }}
                    >
                      <Check className="h-4 w-4 mr-1" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        setRowAction({
                          type: 'edit',
                          id: row.original.id,
                          updates: { status: 'REJECTED' as ApprovalStatus },
                        })
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50"
                      onClick={() => {
                        setRowAction({
                          type: 'edit',
                          id: row.original.id,
                          updates: { status: 'PENDING' as ApprovalStatus },
                        })
                      }}
                    >
                      <AlarmClock className="h-4 w-4 mr-1" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-slate-600 hover:text-slate-700 hover:bg-slate-50"
                      onClick={() => {
                        setRowAction({
                          type: 'edit',
                          id: row.original.id,
                          updates: { deleted: true },
                        })
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                    </Button>
                  </>
                )}
          </div>
        )
      },
      size: 240,
    },
  ]
}
