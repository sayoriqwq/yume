import { useAtomValue } from 'jotai'
import { articleMapAtom, categoryIdToArticleIdsAtom } from '../store'
import { useArticlesData } from './useArticle'

export function useCategoryArticles(categoryId: number) {
  const categoryIdToArticleIds = useAtomValue(categoryIdToArticleIdsAtom)
  const articleIds = categoryIdToArticleIds[categoryId] || []
  const articleMap = useAtomValue(articleMapAtom)
  const { isLoading, error, mutate } = useArticlesData()

  const articles = articleIds.map(id => articleMap[id]).filter(Boolean)

  return {
    articles,
    articleIds,
    isLoading,
    error,
    mutate,
  }
}
