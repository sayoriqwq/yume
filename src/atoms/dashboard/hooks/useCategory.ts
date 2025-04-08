import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback } from 'react'

import useSWRImmutable from 'swr/immutable'
import { createCategoryAtom, fetchCategoriesAtom, fetchCategoryDetailAtom, optimisticRemoveCategoryAtom, optimisticUpdateCategoryAtom } from '../actions/categories'
import { categoryIdsAtom, categoryIdToArticleIdsAtom, categoryMapAtom } from '../store'
import { useCommonSwrConfig } from '../useSwrConfig'

export function useCategoriesData() {
  const categoryIds = useAtomValue(categoryIdsAtom)
  const categoryMap = useAtomValue(categoryMapAtom)
  const fetchCategories = useSetAtom(fetchCategoriesAtom)
  const createCategory = useSetAtom(createCategoryAtom)
  const updateCategory = useSetAtom(optimisticUpdateCategoryAtom)
  const removeCategory = useSetAtom(optimisticRemoveCategoryAtom)

  // 检查是否已有数据
  const hasData = categoryIds.length > 0

  const swrConfig = useCommonSwrConfig(hasData)

  const cachedFetcher = useCallback(() => fetchCategories(), [fetchCategories])

  // 使用条件请求和自动定时刷新
  const { error, isLoading, mutate } = useSWRImmutable(
    'categories',
    cachedFetcher,
    swrConfig,
  )

  return {
    categoryIds,
    categoryMap,
    isLoading,
    error,
    mutate,
    createCategory,
    updateCategory,
    removeCategory,
  }
}

export function useCategoryDetail(id: number) {
  const categoryMap = useAtomValue(categoryMapAtom)
  const categoryIdToArticleIds = useAtomValue(categoryIdToArticleIdsAtom)
  const fetchCategoryDetail = useSetAtom(fetchCategoryDetailAtom)

  // 检查是否已有数据
  const hasCategory = !!categoryMap[id]
  const hasArticleIds = !!categoryIdToArticleIds[id]
  const hasCompleteData = hasCategory && hasArticleIds

  const swrConfig = useCommonSwrConfig(hasCompleteData)

  // 使用条件请求和自动定时刷新
  const { error, isLoading, mutate } = useSWRImmutable(
    `category-${id}`,
    () => fetchCategoryDetail(id),
    swrConfig,
  )

  return {
    category: categoryMap[id],
    articleIds: categoryIdToArticleIds[id],
    isLoading,
    error,
    mutate,
  }
}
