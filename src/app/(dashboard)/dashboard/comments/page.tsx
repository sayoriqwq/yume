'use client'

import type { Comment } from '@/generated'
import { useCommentsData } from '@/atoms/dashboard/hooks/useComment'
import { BaseDataTable } from '@/components/dashboard/table/base-data-table'
import { Button } from '@/components/ui/button'
import { ApprovalStatus } from '@/generated'
import { RefreshCw } from 'lucide-react'
import { useModalStack } from 'rc-modal-sheet'
import { useCallback, useEffect, useState } from 'react'
import { useColumns } from './columns'
import { CommentDetail } from './comment-detail'

export interface DataTableRowAction<T> {
  type: 'edit' | 'delete'
  id: number
  updates?: Partial<T>
}

export default function CommentsPage() {
  const [rowAction, setRowAction] = useState<DataTableRowAction<Comment> | null>(null)
  const { present } = useModalStack()
  const {
    isLoading,
    error,
    commentIds,
    commentMap,
    updateComment,
    removeComment,
    mutate,
  } = useCommentsData()

  const showCommentDetail = useCallback((id: number) => {
    const modalId = `comment-${id}`
    present({
      id: modalId,
      title: `评论详情 #${id}`,
      content: () => <CommentDetail id={id} />,
    })
  }, [commentMap, present])

  const columns = useColumns({ setRowAction, showCommentDetail })

  // 处理行操作
  useEffect(() => {
    if (!rowAction)
      return

    if (rowAction.type === 'edit' && rowAction.updates) {
      updateComment(rowAction.id, rowAction.updates)
    }
    if (rowAction.type === 'delete') {
      removeComment(rowAction.id)
    }

    // 清除行操作
    setRowAction(null)
  }, [rowAction, updateComment, removeComment])

  // 计算各状态评论数量
  const statusCounts = {
    all: commentIds.length,
    pending: Object.values(commentMap).filter(c => c.status === ApprovalStatus.PENDING).length,
    approved: Object.values(commentMap).filter(c => c.status === ApprovalStatus.APPROVED).length,
    rejected: Object.values(commentMap).filter(c => c.status === ApprovalStatus.REJECTED).length,
  }

  const handleRefresh = () => {
    mutate()
  }

  if (isLoading)
    return <div>加载中...</div>
  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-2">加载评论数据出错</p>
        <Button onClick={handleRefresh}>重试</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">评论管理</h2>
        </div>
        <Button variant="outline" size="icon" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      总计
      {' '}
      {statusCounts.all}
      {' '}
      条评论，其中待审核
      {' '}
      {statusCounts.pending}
      {' '}
      条，已批准
      {' '}
      {statusCounts.approved}
      {' '}
      条，已拒绝
      {' '}
      {statusCounts.rejected}
      {' '}
      条。
      <BaseDataTable
        columns={columns}
        data={commentIds.map(id => commentMap[id])}
        filterKey="content"
      />
    </div>
  )
}
