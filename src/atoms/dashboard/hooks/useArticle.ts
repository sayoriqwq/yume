import type { ArticleType } from '../types'
import { useAtomValue, useSetAtom } from 'jotai'
import useSWRImmutable from 'swr/immutable'
import { createArticleAtom, fetchArticlesAtom, optimisticRemoveArticleAtom, optimisticUpdateArticleAtom } from '../actions/articles'
import { articleIdsAtom, articleMapAtom } from '../store'

export function useArticlesData(type?: ArticleType) {
  const articleIds = useAtomValue(articleIdsAtom)
  const articleMap = useAtomValue(articleMapAtom)
  const fetchArticles = useSetAtom(fetchArticlesAtom)
  const createArticle = useSetAtom(createArticleAtom)
  const updateArticle = useSetAtom(optimisticUpdateArticleAtom)
  const removeArticle = useSetAtom(optimisticRemoveArticleAtom)

  const fetchTypedArticles = () => {
    fetchArticles({ type })
  }

  const { error, isLoading, mutate } = useSWRImmutable('articles', fetchTypedArticles)

  const getAllFilteredArticleIds = () => {
    return type ? articleIds.filter(id => articleMap[id].type === type) : articleIds
  }

  return {
    articleIds: getAllFilteredArticleIds(),
    articleMap,
    isLoading,
    error,
    mutate,
    createArticle,
    updateArticle,
    removeArticle,
  }
}

export function useArticleDetail(id: number) {
  const articleMap = useAtomValue(articleMapAtom)
  return { article: articleMap[id] }
}
