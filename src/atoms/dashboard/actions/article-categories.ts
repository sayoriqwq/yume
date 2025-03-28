import { atom } from 'jotai'
import { articleMapAtom, categoryIdToArticleIdsAtom } from '../store'

// 更新文章的分类
export const updateArticleCategoryAtom = atom(
  null,
  async (get, set, articleId: number, categoryId: number) => {
    const articleMap = get(articleMapAtom)
    const categoryIdToArticleIds = get(categoryIdToArticleIdsAtom)
    const article = articleMap[articleId]

    if (!article) {
      throw new Error(`找不到ID为${articleId}的文章`)
    }

    // 从原分类中移除
    const oldCategoryId = article.categoryId
    if (oldCategoryId) {
      const oldArticleIds = categoryIdToArticleIds[oldCategoryId] || []
      set(categoryIdToArticleIdsAtom, {
        ...categoryIdToArticleIds,
        [oldCategoryId]: oldArticleIds.filter(id => id !== articleId),
      })
    }

    // 添加到新分类
    const newArticleIds = categoryIdToArticleIds[categoryId] || []
    set(categoryIdToArticleIdsAtom, {
      ...categoryIdToArticleIds,
      [categoryId]: [...newArticleIds, articleId],
    })

    // 更新文章的分类ID
    set(articleMapAtom, {
      ...articleMap,
      [articleId]: {
        ...article,
        categoryId,
      },
    })

    return true
  },
)

// 批量更新文章的分类
export const batchUpdateArticleCategoriesAtom = atom(
  null,
  async (get, set, articleIds: number[], categoryId: number) => {
    const articleMap = get(articleMapAtom)
    const categoryIdToArticleIds = get(categoryIdToArticleIdsAtom)

    // 从原分类中移除
    const oldCategoryIds = new Set(
      articleIds.map(id => articleMap[id]?.categoryId).filter(Boolean),
    )

    for (const oldCategoryId of oldCategoryIds) {
      const oldArticleIds = categoryIdToArticleIds[oldCategoryId] || []
      set(categoryIdToArticleIdsAtom, {
        ...categoryIdToArticleIds,
        [oldCategoryId]: oldArticleIds.filter(id => !articleIds.includes(id)),
      })
    }

    // 添加到新分类
    const newArticleIds = categoryIdToArticleIds[categoryId] || []
    set(categoryIdToArticleIdsAtom, {
      ...categoryIdToArticleIds,
      [categoryId]: [...new Set([...newArticleIds, ...articleIds])],
    })

    // 更新文章的分类ID
    const updatedArticleMap = { ...articleMap }
    for (const articleId of articleIds) {
      if (updatedArticleMap[articleId]) {
        updatedArticleMap[articleId] = {
          ...updatedArticleMap[articleId],
          categoryId,
        }
      }
    }
    set(articleMapAtom, updatedArticleMap)

    return true
  },
)

// 获取文章详情
export const fetchArticleDetailAtom = atom(
  null,
  async (get, set, id: number) => {
    try {
      const response = await fetch(`/api/admin/articles/${id}`)
      if (!response.ok) {
        throw new Error(`获取文章详情失败: ${response.status} ${response.statusText}`)
      }

      const { objects } = await response.json()
      set(articleMapAtom, objects.articles)
      return objects.articles[id]
    }
    catch (error) {
      console.error('获取文章详情出错:', error)
      throw error
    }
  },
)
