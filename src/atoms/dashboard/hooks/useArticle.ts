import type { PageParams } from '@/types/page'
import type { ArticleType } from '../types'
import { useAtomValue, useSetAtom } from 'jotai'
import useSWRImmutable from 'swr/immutable'
import { createArticleAtom, fetchArticlesAtom, optimisticRemoveArticleAtom, optimisticUpdateArticleAtom } from '../actions/articles'
import { articleIdsAtom, articleIdToTagIdsAtom, articleMapAtom, articlesTotalCountAtom } from '../store'

export interface UseArticlesDataParams {
  type?: ArticleType
  pageParams?: PageParams
}

export function useArticlesData(params?: UseArticlesDataParams) {
  const articleIds = useAtomValue(articleIdsAtom)
  const articleMap = useAtomValue(articleMapAtom)
  const articlesTotal = useAtomValue(articlesTotalCountAtom)
  const fetchArticles = useSetAtom(fetchArticlesAtom)
  const createArticle = useSetAtom(createArticleAtom)
  const updateArticle = useSetAtom(optimisticUpdateArticleAtom)
  const removeArticle = useSetAtom(optimisticRemoveArticleAtom)

  const fetchArticlesWithParams = () => {
    if (params) {
      fetchArticles({
        type: params.type,
        pageParams: params.pageParams,
      })
    }
    else {
      fetchArticles()
    }
  }

  const { error, isLoading, mutate } = useSWRImmutable(
    // 将分页参数作为缓存键的一部分，确保分页改变时重新获取数据
    params
      ? ['articles', params.type, params.pageParams?.page, params.pageParams?.pageSize].filter(Boolean).join('-')
      : 'articles',
    fetchArticlesWithParams,
  )

  return {
    articleIds,
    articleMap,
    articlesTotal,
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
  const articleIdToTagIdsMap = useAtomValue(articleIdToTagIdsAtom)
  return { article: articleMap[id], articleIdToTagIdsMap }
}
