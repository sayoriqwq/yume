import type { Category } from '../store'
import useSWR from 'swr'
import { useNormalizeResponse } from '../normalize'

interface CategoriesResponse {
  data: {
    categoryIds: number[]
  }
  objects: {
    categories: Record<number, Category>
  }
}

export function useCategories() {
  const normalizeResponse = useNormalizeResponse()

  return useSWR<CategoriesResponse>('/api/categories', async (url: string) => {
    const res = await fetch(url)
    const data = await res.json()

    // 规范化并存储数据
    normalizeResponse(data)
    return data
  })
}

export function useCategoryByName(name?: string) {
  const normalizeResponse = useNormalizeResponse()

  return useSWR<{ data: { categoryId: number } }>(
    name ? `/api/categories/by-name/${encodeURIComponent(name)}` : null,
    async (url: string) => {
      const res = await fetch(url)
      const data = await res.json()

      // 规范化并存储数据
      normalizeResponse(data)
      return data
    },
  )
}
