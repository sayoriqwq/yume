import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback } from 'react'

import useSWRImmutable from 'swr/immutable'
import { createCategoryAtom, fetchCategoriesAtom, optimisticRemoveCategoryAtom, optimisticUpdateCategoryAtom } from '../actions/categories'
import { categoryIdsAtom, categoryMapAtom } from '../store'
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
