import type { Tag } from '@/generated'
import type { SingleData, SingleDeleteData } from '@/lib/api'
import type { NormalizedTag, TagsResponse } from '../types'
import { errorLogger, errorToaster } from '@/lib/error-handler'
import { yumeFetchDelete, yumeFetchGet, yumeFetchPatch, yumeFetchPost } from '@/lib/yume-fetcher'
import { createYumeError, extractYumeError, YumeErrorType } from '@/lib/YumeError'
import { atom } from 'jotai'
import toast from 'react-hot-toast'
import { articleMapAtom, tagIdsAtom, tagMapAtom } from '../store'

// 获取标签列表
export const fetchTagsAtom = atom(
  null,
  async (get, set) => {
    const response = await yumeFetchGet<TagsResponse>('/admin/tags')
    if (typeof response === 'string') {
      throw extractYumeError(response)
    }
    const { data, objects } = response
    set(tagIdsAtom, { type: 'set', ids: data.map(tag => tag.id) })

    const tagMap = data.reduce((acc, tag) => {
      acc[tag.id] = tag
      return acc
    }, {} as Record<number, Tag>)
    set(tagMapAtom, tagMap)

    if (objects && objects.articles) {
      set(articleMapAtom, objects.articles)
    }
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
  async (get, set, id: number, updates: Partial<NormalizedTag>) => {
    const originalTagMap = get(tagMapAtom)
    const originalTag = originalTagMap[id]
    const rollback = () => {
      set(tagMapAtom, originalTagMap)
    }
    // 先乐观更新本地数据
    set(tagMapAtom, { [id]: updates })

    try {
      if (!originalTag) {
        throw createYumeError(new Error(`找不到ID为 ${id} 的标签`), YumeErrorType.NotFoundError)
      }

      const response = await yumeFetchPatch<SingleData<NormalizedTag>>(`/admin/tags/${id}`, updates)
      if (typeof response === 'string') {
        throw extractYumeError(response)
      }
      const { data: updatedTag } = response

      // 用真实数据替换本地数据
      set(tagMapAtom, { [id]: updatedTag })

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
    const originalTagIds = get(tagIdsAtom)
    const originalTag = originalTagMap[id]
    const rollback = () => {
      set(tagMapAtom, originalTagMap)
      set(tagIdsAtom, { type: 'set', ids: originalTagIds })
    }

    // 先乐观删除本地数据
    const { [id]: _removed, ...restMap } = originalTagMap
    set(tagMapAtom, restMap)
    set(tagIdsAtom, { type: 'remove', ids: [id] })

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
