import { useAtomValue, useSetAtom } from 'jotai'
import useSWRImmutable from 'swr/immutable'

import { createCategoryAtom, fetchCategoriesAtom, fetchCategoryDetailAtom, optimisticRemoveCategoryAtom, optimisticUpdateCategoryAtom } from '../actions/categories'
import { categoryIdsAtom, categoryIdToArticleIdsAtom, categoryMapAtom } from '../store'

export function useCategoriesData() {
  const categoryIds = useAtomValue(categoryIdsAtom)
  const categoryMap = useAtomValue(categoryMapAtom)
  const fetchCategories = useSetAtom(fetchCategoriesAtom)
  const createCategory = useSetAtom(createCategoryAtom)
  const updateCategory = useSetAtom(optimisticUpdateCategoryAtom)
  const removeCategory = useSetAtom(optimisticRemoveCategoryAtom)

  const { error, isLoading, mutate } = useSWRImmutable('categories', fetchCategories)

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

  const { error, isLoading, mutate } = useSWRImmutable(`${id}`, fetchCategoryDetail)

  return {
    category: categoryMap[id],
    articleIds: categoryIdToArticleIds[id],
    isLoading,
    error,
    mutate,
  }
}
