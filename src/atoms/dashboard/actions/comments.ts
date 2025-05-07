import type { CommentsApiResponse } from '@/app/api/admin/comments/route'
import type { ApprovalStatus, Comment } from '@/generated'
import type { SingleData, SingleDeleteData } from '@/lib/api'
import { errorLogger, errorToaster } from '@/lib/error-handler'
import { yumeFetchDelete, yumeFetchGet, yumeFetchPatch } from '@/lib/yume-fetcher'
import { extractYumeError } from '@/lib/YumeError'
import { atom } from 'jotai'
import toast from 'react-hot-toast'
import { articleIdToCommentsIdsAtom, commentIdsAtom, commentIdToRepliesIdsAtom, commentMapAtom, commentsTotalCountAtom } from '../store'

// 获取评论列表
export const fetchCommentsAtom = atom(
  null,
  async (get, set, options?: { status?: ApprovalStatus, articleId?: number }) => {
    const queryParams = new URLSearchParams()
    if (options?.status)
      queryParams.append('status', options.status)
    if (options?.articleId)
      queryParams.append('articleId', options.articleId.toString())

    const response = await yumeFetchGet<CommentsApiResponse>('/admin/comments', Object.fromEntries(queryParams))
    if (typeof response === 'string') {
      throw extractYumeError(response)
    }

    const { data, objects } = response
    set(commentIdsAtom, { type: 'set', ids: data.commentIds })
    set(commentMapAtom, objects.commentMap)
    set(commentIdToRepliesIdsAtom, objects.commentIdToRepliesIds)
    set(articleIdToCommentsIdsAtom, objects.articleIdToCommentsIds)
    set(commentsTotalCountAtom, data.count)
  },
)

// 更新评论状态
export const optimisticUpdateCommentAtom = atom(
  null,
  async (get, set, id: number, updates: {
    content?: string
    status?: ApprovalStatus
    deleted?: boolean
  }) => {
    const originalCommentMap = get(commentMapAtom)
    const originalComment = originalCommentMap[id]

    // 回滚函数
    const rollback = () => {
      set(commentMapAtom, originalCommentMap)
    }

    // 先乐观更新本地数据
    set(commentMapAtom, {
      ...originalCommentMap,
      [id]: { ...originalComment, ...updates } as Comment,
    })

    try {
      if (!originalComment) {
        throw new Error(`Comment with id ${id} not found`)
      }

      const response = await yumeFetchPatch<SingleData<Comment>>(`/admin/comments/${id}`, updates)
      if (typeof response === 'string') {
        throw extractYumeError(response)
      }

      const { id: updatedId, data: updatedComment } = response

      // 用真实数据替换本地数据
      set(commentMapAtom, { ...get(commentMapAtom), [updatedId]: updatedComment })

      const statusMessage = updates.status
        ? `评论状态已更改为${updates.status === 'APPROVED' ? '已批准' : updates.status === 'REJECTED' ? '已拒绝' : '待审核'}`
        : updates.deleted
          ? '评论已删除'
          : '评论已更新'

      toast.success(statusMessage)
    }
    catch (error) {
      rollback()
      errorLogger(error)
      errorToaster(error)
    }
  },
)

// 软删除评论
export const optimisticRemoveCommentAtom = atom(
  null,
  async (get, set, id: number) => {
    const originalCommentMap = get(commentMapAtom)
    const originalCommentIds = get(commentIdsAtom)
    const originalComment = originalCommentMap[id]

    // 回滚函数
    const rollback = () => {
      set(commentMapAtom, originalCommentMap)
      set(commentIdsAtom, { type: 'set', ids: originalCommentIds })
    }

    // 先乐观更新本地数据
    const newCommentMap = { ...originalCommentMap }
    newCommentMap[id] = { ...originalComment, deleted: true } as Comment
    set(commentMapAtom, newCommentMap)

    try {
      if (!originalComment) {
        throw new Error(`Comment with id ${id} not found`)
      }

      const response = await yumeFetchDelete<SingleDeleteData>(`/admin/comments/${id}`)
      if (typeof response === 'string') {
        throw extractYumeError(response)
      }

      if (!response.success) {
        throw new Error('Failed to delete comment')
      }

      toast.success('评论已删除')
    }
    catch (error) {
      rollback()
      errorLogger(error)
      errorToaster(error)
    }
  },
)
