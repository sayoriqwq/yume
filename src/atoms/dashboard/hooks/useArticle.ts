import type { ArticleType } from '@/generated'
import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback } from 'react'
import useSWRImmutable from 'swr/immutable'
import { createArticleAtom, fetchArticlesAtom, optimisticRemoveArticleAtom, optimisticUpdateArticleAtom } from '../actions/articles'
import { articleIdsAtom, articleMapAtom } from '../store'
import { useCommonSwrConfig } from '../useSwrConfig'

export function useArticlesData(type?: ArticleType) {
  const articleIds = useAtomValue(articleIdsAtom)
  const articleMap = useAtomValue(articleMapAtom)

  const fetchArticles = useSetAtom(fetchArticlesAtom)
  const createArticle = useSetAtom(createArticleAtom)
  const updateArticle = useSetAtom(optimisticUpdateArticleAtom)
  const removeArticle = useSetAtom(optimisticRemoveArticleAtom)

  const hasData = articleIds.length > 0
  const swrConfig = useCommonSwrConfig(hasData)

  const cachedFetcher = useCallback(() => fetchArticles(type), [fetchArticles, type])

  const { error, isLoading, mutate } = useSWRImmutable(
    'articles',
    cachedFetcher,
    swrConfig,
  )

  return {
    articleIds,
    articleMap,
    isLoading,
    error,
    mutate,
    createArticle,
    updateArticle,
    removeArticle,
  }
}
