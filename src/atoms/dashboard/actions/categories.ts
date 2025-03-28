import type { Category } from '../types'
import { atom } from 'jotai'
import { categoryIdsAtom, categoryIdToArticleIdsAtom, categoryMapAtom } from '../store'

// 获取分类列表
export const fetchCategoriesAtom = atom(
  null,
  async (get, set) => {
    try {
      const response = await fetch('/api/admin/categories')
      if (!response.ok) {
        throw new Error(`获取分类失败: ${response.status} ${response.statusText}`)
      }

      const { data, objects } = await response.json()
      set(categoryMapAtom, objects.categories)
      set(categoryIdsAtom, data.categoryIds)
      return { data, objects }
    }
    catch (error) {
      console.error('获取分类列表出错:', error)
      throw error
    }
  },
)

// 创建新分类
export const createCategoryAtom = atom(
  null,
  async (get, set, newCategory: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'count'>) => {
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      })

      if (!response.ok) {
        throw new Error(`创建分类失败: ${response.status} ${response.statusText}`)
      }

      const { data, objects } = await response.json()
      set(categoryMapAtom, objects.categories)
      set(categoryIdsAtom, data.categoryIds)
      return objects.categories[Object.keys(objects.categories)[0]]
    }
    catch (error) {
      console.error('创建分类出错:', error)
      throw error
    }
  },
)

// 乐观更新分类
export const optimisticUpdateCategoryAtom = atom(
  null,
  async (get, set, id: number, updates: Partial<Category>) => {
    const originalCategoryMap = get(categoryMapAtom)
    const originalCategory = originalCategoryMap[id]
    if (!originalCategory) {
      throw new Error(`找不到ID为${id}的分类`)
    }

    // 先乐观更新本地数据
    set(categoryMapAtom, {
      ...originalCategoryMap,
      [id]: { ...originalCategory, ...updates },
    })

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        // 如果请求失败，回滚到原始数据
        set(categoryMapAtom, originalCategoryMap)
        throw new Error(`更新分类失败: ${response.status} ${response.statusText}`)
      }

      const { objects } = await response.json()
      set(categoryMapAtom, objects.categories)

      return objects.categories[id]
    }
    catch (error) {
      console.error('更新分类出错:', error)
      throw error
    }
  },
)

// 乐观删除分类
export const optimisticRemoveCategoryAtom = atom(
  null,
  async (get, set, id: number) => {
    const originalCategoryMap = get(categoryMapAtom)
    const originalCategoryIds = get(categoryIdsAtom)
    const originalCategory = originalCategoryMap[id]
    if (!originalCategory) {
      throw new Error(`找不到ID为${id}的分类`)
    }

    // 先乐观删除本地数据
    const { [id]: removed, ...rest } = originalCategoryMap

    set(categoryMapAtom, rest)
    set(categoryIdsAtom, originalCategoryIds.filter(itemId => itemId !== id))

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        // 如果请求失败，回滚到原始数据
        set(categoryMapAtom, originalCategoryMap)
        set(categoryIdsAtom, originalCategoryIds)
        throw new Error(`删除分类失败: ${response.status} ${response.statusText}`)
      }
    }
    catch (error) {
      console.error('删除分类出错:', error)
      throw error
    }
  },
)

// 获取分类详情
export const fetchCategoryDetailAtom = atom(
  null,
  async (get, set, id: number) => {
    try {
      const response = await fetch(`/api/admin/categories/${id}`)
      if (!response.ok) {
        throw new Error(`获取分类详情失败: ${response.status} ${response.statusText}`)
      }

      const { data, objects } = await response.json()
      set(categoryIdToArticleIdsAtom, data.categoryIdToArticleIds)
      set(categoryMapAtom, objects.categories)

      return objects.categories[id]
    }
    catch (error) {
      console.error('获取分类详情出错:', error)
      throw error
    }
  },
)
