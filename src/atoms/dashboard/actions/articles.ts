import type { Article } from '../types'
import { produce } from 'immer'
import { atom } from 'jotai'
import { articleIdsAtom, articleIdToCategoryIdAtom, articleIdToTagIdsAtom, articleMapAtom } from '../store'

// 获取文章列表
export const fetchArticlesAtom = atom(
  null,
  async (get, set) => {
    try {
      const response = await fetch('/api/admin/articles')
      if (!response.ok) {
        throw new Error(`获取文章失败: ${response.status} ${response.statusText}`)
      }

      const { data, objects } = await response.json()
      set(articleMapAtom, objects.articles)
      set(articleIdsAtom, data.articleIds)
      set(articleIdToCategoryIdAtom, data.articleIdToCategoryId)
      set(articleIdToTagIdsAtom, data.articleIdToTagIds)
      return { data, objects }
    }
    catch (error) {
      console.error('获取文章列表出错:', error)
      throw error
    }
  },
)

// 创建新文章
export const createArticleAtom = atom(
  null,
  async (get, set, newArticle: Omit<Article, 'id'>) => {
    try {
      const response = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArticle),
      })

      if (!response.ok) {
        throw new Error(`创建文章失败: ${response.status} ${response.statusText}`)
      }

      const { data, objects } = await response.json()
      set(articleMapAtom, objects.articles)
      set(articleIdsAtom, data.articleIds)
      return objects.articles[Object.keys(objects.articles)[0]]
    }
    catch (error) {
      console.error('创建文章出错:', error)
      throw error
    }
  },
)

// 乐观更新文章
export const optimisticUpdateArticleAtom = atom(
  null,
  async (get, set, id: number, updates: Partial<Article>) => {
    const originalArticleMap = get(articleMapAtom)
    const originalArticleIds = get(articleIdsAtom)
    const originalArticle = originalArticleMap[id]
    if (!originalArticle) {
      throw new Error(`找不到ID为${id}的文章`)
    }

    // 先乐观更新本地数据
    set(articleMapAtom, produce(originalArticleMap, (draft) => {
      draft[id] = { ...originalArticle, ...updates }
    }))

    set(articleIdsAtom, produce(originalArticleIds, (draft) => {
      draft[id] = id
    }))

    try {
      const response = await fetch(`/api/admin/articles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        // 如果请求失败，回滚到原始数据
        set(articleMapAtom, originalArticleMap)
        set(articleIdsAtom, originalArticleIds)
        throw new Error(`更新文章失败: ${response.status} ${response.statusText}`)
      }

      const { objects } = await response.json()
      set(articleMapAtom, objects.articles)
      return objects.articles[id]
    }
    catch (error) {
      console.error('更新文章出错:', error)
      throw error
    }
  },
)

// 乐观删除文章
export const optimisticRemoveArticleAtom = atom(
  null,
  async (get, set, id: number) => {
    const originalArticles = get(articleMapAtom)
    const originalArticle = originalArticles[id]
    if (!originalArticle) {
      throw new Error(`找不到ID为${id}的文章`)
    }

    // 先乐观删除本地数据
    set(articleMapAtom, produce(originalArticles, (draft) => {
      delete draft[id]
    }))

    try {
      const response = await fetch(`/api/admin/articles/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        // 如果请求失败，回滚到原始数据
        set(articleMapAtom, originalArticles)
        throw new Error(`删除文章失败: ${response.status} ${response.statusText}`)
      }

      return true
    }
    catch (error) {
      console.error('删除文章出错:', error)
      throw error
    }
  },
)
