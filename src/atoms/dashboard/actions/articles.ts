import type { Article, ArticleType } from '@/generated'
import type { SingleData, SingleDeleteData } from '@/lib/api'
import type { ArticlesResponse, NormalizedArticle } from '../types'
import { errorLogger, errorToaster } from '@/lib/error-handler'
import { yumeFetchDelete, yumeFetchGet, yumeFetchPatch, yumeFetchPost } from '@/lib/yume-fetcher'
import { createYumeError, extractYumeError, YumeErrorType } from '@/lib/YumeError'
import { atom } from 'jotai'
import toast from 'react-hot-toast'
import { articleIdsAtom, articleMapAtom, categoryMapAtom, commentMapAtom, tagMapAtom } from '../store'

// 获取文章列表
export const fetchArticlesAtom = atom(
  null,
  async (get, set, type?: ArticleType) => {
    const response = await yumeFetchGet<ArticlesResponse>('/admin/articles', type ? { type } : undefined)
    if (typeof response === 'string') {
      throw extractYumeError(response)
    }
    const { data, objects } = response

    // 更新文章ID列表
    set(articleIdsAtom, { type: 'set', ids: data.map(article => article.id) })

    const articleMap = data.reduce((acc, article) => {
      acc[article.id] = article
      return acc
    }, {} as Record<number, typeof data[0]>)

    // 更新文章映射
    set(articleMapAtom, articleMap)

    // 更新关联数据
    if (objects.categories) {
      set(categoryMapAtom, objects.categories)
    }
    if (objects.tags) {
      set(tagMapAtom, objects.tags)
    }
    if (objects.comments) {
      set(commentMapAtom, objects.comments)
    }
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
    set(articleMapAtom, { [id]: data })
    set(articleIdsAtom, { type: 'add', ids: [id] })
  },
)

export const optimisticUpdateArticleAtom = atom(
  null,
  async (get, set, id: number, updates: Partial<NormalizedArticle>) => {
    const originalArticleMap = get(articleMapAtom)
    const originalArticle = originalArticleMap[id]
    const rollback = () => {
      set(articleMapAtom, originalArticleMap)
    }
    // 先乐观更新本地数据
    set(articleMapAtom, { [id]: updates })

    try {
      if (!originalArticle) {
        throw createYumeError(new Error(`找不到ID为${id}的文章`), YumeErrorType.NotFoundError)
      }

      const response = await yumeFetchPatch<SingleData<NormalizedArticle>>(`/admin/articles/${id}`, updates)
      if (typeof response === 'string') {
        throw extractYumeError(response)
      }

      const { data } = response

      // 用真实数据替换本地数据
      set(articleMapAtom, { [id]: data })
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
