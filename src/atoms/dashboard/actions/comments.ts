import type { ApprovalStatus, Comment } from '@/generated'
import type { SingleData, SingleDeleteData } from '@/lib/api'
import type { CommentsResponse } from '../types'
import { errorLogger, errorToaster } from '@/lib/error-handler'
import { yumeFetchDelete, yumeFetchGet, yumeFetchPatch } from '@/lib/yume-fetcher'
import { extractYumeError } from '@/lib/YumeError'
import { atom } from 'jotai'
import toast from 'react-hot-toast'
import { articleMapAtom, commentIdsAtom, commentMapAtom } from '../store'

// 获取评论列表
export const fetchCommentsAtom = atom(
  null,
  async (get, set, options?: { status?: ApprovalStatus }) => {
    const params = options?.status ? { status: options.status } : undefined
    const response = await yumeFetchGet<CommentsResponse>('/admin/comments', params)
    if (typeof response === 'string') {
      throw extractYumeError(response)
    }

    const { data, objects } = response

    const commentMap = data.reduce((acc, comment) => {
      acc[comment.id] = comment
      return acc
    }, {} as Record<number, Comment>)
    set(commentIdsAtom, { type: 'set', ids: data.map(comment => comment.id) })
    set(commentMapAtom, commentMap)

    if (objects.articles) {
      set(articleMapAtom, objects.articles)
    }
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
      [id]: updates,
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
    newCommentMap[id] = { ...originalComment, deleted: true }
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
