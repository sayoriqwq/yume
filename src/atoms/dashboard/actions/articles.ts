import type { ArticlesResponse } from '@/app/api/admin/articles/route'
import type { SingleData, SingleDeleteData } from '@/lib/api'
import type { PageParams } from '@/types/page'
import type { Article } from '../types'
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/constants/page'
import { errorLogger, errorToaster } from '@/lib/error-handler'
import { yumeFetchDelete, yumeFetchGet, yumeFetchPatch, yumeFetchPost } from '@/lib/yume-fetcher'
import { createYumeError, extractYumeError, YumeErrorType } from '@/lib/YumeError'
import { atom } from 'jotai'
import toast from 'react-hot-toast'
import { articleIdsAtom, articleIdToCategoryIdAtom, articleIdToTagIdsAtom, articleMapAtom } from '../store'

// 获取文章列表
export interface FetchArticlesParams {
  pageParams?: PageParams
  type?: string
}
export const fetchArticlesAtom = atom(
  null,
  async (get, set, params?: FetchArticlesParams) => {
    const query: Record<string, string | number> = {}

    if (params) {
      if (params.type) {
        query.type = params.type
      }
      if (params.pageParams) {
        const { page, pageSize } = params.pageParams
        query.page = Number(page) || DEFAULT_PAGE
        query.pageSize = Number(pageSize) || DEFAULT_PAGE_SIZE
      }
    }

    const response = await yumeFetchGet<ArticlesResponse>('/admin/articles', query)
    if (typeof response === 'string') {
      throw extractYumeError(response)
    }
    const { data, objects } = response

    set(articleIdsAtom, { type: 'set', ids: data.articleIds })
    set(articleMapAtom, objects.articleMap)
    set(articleIdToCategoryIdAtom, objects.articleIdToCategoryId)
    set(articleIdToTagIdsAtom, objects.articleIdToTagIds)
  },
)

// 创建新文章
export const createArticleAtom = atom(
  null,
  async (get, set, newArticleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>) => {
    const response = await yumeFetchPost<SingleData<Article>>('/admin/articles', newArticleData)
    if (typeof response === 'string') {
      throw extractYumeError(response)
    }
    const { id, data } = response
    set(articleMapAtom, { ...get(articleMapAtom), [id]: data })
    set(articleIdsAtom, { type: 'add', ids: [id] })
  },
)

export const optimisticUpdateArticleAtom = atom(
  null,
  async (get, set, id: number, updates: Partial<Article>) => {
    const originalArticleMap = get(articleMapAtom)
    const originalArticle = originalArticleMap[id]
    const rollback = () => {
      set(articleIdsAtom, { type: 'remove', ids: [id] })
      set(articleMapAtom, originalArticleMap)
    }
    // 先乐观更新本地数据
    set(articleIdsAtom, { type: 'add', ids: [id] })
    set(articleMapAtom, { [id]: { ...originalArticle, ...updates } })

    try {
      if (!originalArticle) {
        throw createYumeError(new Error(`找不到ID为${id}的文章`), YumeErrorType.NotFoundError)
      }

      const response = await yumeFetchPatch<SingleData<Article>>(`/admin/articles/${id}`, updates)
      if (typeof response === 'string') {
        throw extractYumeError(response)
      }
      const { id: updatedId, data: updatedArticle } = response

      // 用真实数据替换本地数据
      set(articleMapAtom, { [updatedId]: updatedArticle })
      set(articleIdsAtom, { type: 'add', ids: [updatedId] })
      toast.success(`更新文章${originalArticle.title}成功`)
    }
    catch (error) {
      rollback()
      errorLogger(error)
      errorToaster(error)
    }
  },
)
export const optimisticRemoveArticleAtom = atom(
  null,
  async (get, set, id: number) => {
    const originalArticleMap = get(articleMapAtom)
    const originalArticle = originalArticleMap[id]
    const rollback = () => {
      set(articleIdsAtom, { type: 'add', ids: [id] })
      set(articleMapAtom, originalArticleMap)
    }
    // 先乐观删除本地数据
    const { [id]: _removed, ...rest } = originalArticleMap
    set(articleIdsAtom, { type: 'remove', ids: [id] })
    set(articleMapAtom, rest)

    try {
      if (!originalArticle) {
        throw createYumeError(new Error(`找不到ID为${id}的文章`), YumeErrorType.NotFoundError)
      }

      const response = await yumeFetchDelete<SingleDeleteData>(`/admin/articles/${id}`)
      if (typeof response === 'string') {
        throw extractYumeError(response)
      }
      if (!response.success) {
        throw createYumeError(new Error(`删除文章失败`), YumeErrorType.BadRequestError)
      }
      toast.success('删除文章成功')
    }
    catch (error) {
      rollback()
      errorLogger(error)
      errorToaster(error)
    }
  },
)
