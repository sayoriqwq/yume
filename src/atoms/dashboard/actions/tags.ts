import type { TagsApiResponse } from '@/app/api/admin/tags/route'
import type { SingleData, SingleDeleteData } from '@/lib/api'
import type { Tag } from '../types'
import { errorLogger, errorToaster } from '@/lib/error-handler'
import { yumeFetchDelete, yumeFetchGet, yumeFetchPatch, yumeFetchPost } from '@/lib/yume-fetcher'
import { createYumeError, extractYumeError, YumeErrorType } from '@/lib/YumeError'
import { atom } from 'jotai'
import toast from 'react-hot-toast'
import { tagIdsAtom, tagIdToArticleIdsAtom, tagMapAtom } from '../store'

// 获取标签列表
export const fetchTagsAtom = atom(
  null,
  async (get, set) => {
    const response = await yumeFetchGet<TagsApiResponse>('/admin/tags')
    if (typeof response === 'string') {
      throw extractYumeError(response)
    }
    const { data, objects } = response
    set(tagIdsAtom, { type: 'set', ids: data.tagIds })
    set(tagMapAtom, objects.tagMap)
    set(tagIdToArticleIdsAtom, objects.tagIdToArticleIds)
  },
)

// 创建新标签
export const createTagAtom = atom(
  null,
  async (get, set, newTag: Omit<Tag, 'id' | 'createdAt' | 'updatedAt' | 'count'>) => {
    const response = await yumeFetchPost<SingleData<Tag>>('/admin/tags', newTag)
    if (typeof response === 'string') {
      throw extractYumeError(response)
    }
    const { id, data } = response
    set(tagMapAtom, { [id]: data })
    set(tagIdsAtom, { type: 'add', ids: [id] })
    toast.success(`创建标签 ${data.name} 成功`)
  },
)

// 乐观更新标签
export const optimisticUpdateTagAtom = atom(
  null,
  async (get, set, id: number, updates: Partial<Tag> & { articleIds?: number[] }) => {
    const originalTagMap = get(tagMapAtom)
    const originalTag = originalTagMap[id]
    const originalTagIdToArticleIds = get(tagIdToArticleIdsAtom)
    const rollback = () => {
      set(tagMapAtom, originalTagMap)
      set(tagIdToArticleIdsAtom, originalTagIdToArticleIds)
    }
    // 先乐观更新本地数据
    set(tagMapAtom, { ...originalTagMap, [id]: { ...originalTag, ...updates } as Tag })

    try {
      if (!originalTag) {
        throw createYumeError(new Error(`找不到ID为 ${id} 的标签`), YumeErrorType.NotFoundError)
      }

      const response = await yumeFetchPatch<SingleData<Tag>>(`/admin/tags/${id}`, updates)
      if (typeof response === 'string') {
        throw extractYumeError(response)
      }
      const { id: updatedId, data: updatedTag } = response

      // 用真实数据替换本地数据
      set(tagMapAtom, { ...get(tagMapAtom), [updatedId]: updatedTag })
      if (updates.articleIds) {
        set(tagIdToArticleIdsAtom, { [updatedId]: updates.articleIds })
      }
      toast.success(`更新标签 ${originalTag.name} 成功`)
    }
    catch (error) {
      rollback()
      errorLogger(error)
      errorToaster(error)
    }
  },
)

// 乐观删除标签
export const optimisticRemoveTagAtom = atom(
  null,
  async (get, set, id: number) => {
    const originalTagMap = get(tagMapAtom)
    const originalTagIds = get(tagIdsAtom) // Get original IDs for rollback
    const originalTag = originalTagMap[id]
    const rollback = () => {
      set(tagMapAtom, originalTagMap)
      set(tagIdsAtom, { type: 'set', ids: originalTagIds }) // Rollback IDs
    }

    // 先乐观删除本地数据
    const { [id]: _removed, ...restMap } = originalTagMap
    const restIds = originalTagIds.filter(tagId => tagId !== id)
    set(tagMapAtom, restMap)
    set(tagIdsAtom, { type: 'set', ids: restIds })

    try {
      if (!originalTag) {
        throw createYumeError(new Error(`找不到ID为 ${id} 的标签`), YumeErrorType.NotFoundError)
      }
      const response = await yumeFetchDelete<SingleDeleteData>(`/admin/tags/${id}`)
      if (typeof response === 'string') {
        throw extractYumeError(response)
      }
      if (!response.success) {
        throw createYumeError(new Error('删除失败'), YumeErrorType.BadRequestError)
      }
      toast.success(`删除标签 ${originalTag.name} 成功`)
    }
    catch (error) {
      rollback()
      errorLogger(error)
      errorToaster(error)
    }
  },
)
