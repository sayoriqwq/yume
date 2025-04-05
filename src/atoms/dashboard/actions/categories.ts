import type { CategoryDetailResponse } from '@/app/api/admin/categories/[id]/route'
import type { CategoriesApiResponse } from '@/app/api/admin/categories/route'
import type { SingleData, SingleDeleteData } from '@/lib/api'
import type { Category } from '../types'
import { errorLogger, errorToaster } from '@/lib/error-handler'
import { yumeFetchDelete, yumeFetchGet, yumeFetchPatch, yumeFetchPost } from '@/lib/yume-fetcher'
import { createYumeError, extractYumeError, YumeErrorType } from '@/lib/YumeError'
import { atom } from 'jotai'
import toast from 'react-hot-toast'
import { articleIdsAtom, categoryIdsAtom, categoryIdToArticleIdsAtom, categoryMapAtom } from '../store'

// 获取分类列表
export const fetchCategoriesAtom = atom(
  null,
  async (get, set) => {
    const response = await yumeFetchGet<CategoriesApiResponse>('/admin/categories?page=1&pageSize=10')
    if (typeof response === 'string') {
      throw extractYumeError(response)
    }
    const { data, objects } = response
    set(categoryIdsAtom, { type: 'set', ids: data.categoryIds })
    set(categoryMapAtom, objects.categories)
    set(categoryIdToArticleIdsAtom, objects.categoryIdToArticleIds)
  },
)

// 创建新分类
export const createCategoryAtom = atom(
  null,
  async (get, set, newCategory: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'count'>) => {
    const response = await yumeFetchPost<SingleData<Category>>('/admin/categories', newCategory)
    if (typeof response === 'string') {
      throw extractYumeError(response)
    }
    const { id, data } = response
    set(categoryMapAtom, { ...get(categoryMapAtom), [id]: data })
    set(categoryIdsAtom, { type: 'add', ids: [id] })
    toast.success(`创建分类${data.name}成功`)
  },
)

// 乐观更新分类
export const optimisticUpdateCategoryAtom = atom(
  null,
  async (get, set, id: number, updates: Partial<Category>) => {
    const originalCategoryMap = get(categoryMapAtom)
    const originalCategory = originalCategoryMap[id]
    const rollback = () => {
      set(categoryIdsAtom, { type: 'remove', ids: [id] })
      set(categoryMapAtom, originalCategoryMap)
    }
    // 先乐观更新本地数据
    set(categoryIdsAtom, { type: 'add', ids: [id] })
    set(categoryMapAtom, { [id]: { ...originalCategory, ...updates } })

    try {
      if (!originalCategory) {
        throw createYumeError(new Error(`找不到ID为${id}的分类`), YumeErrorType.NotFoundError)
      }

      const response = await yumeFetchPatch<SingleData<Category>>(`/admin/categories/${id}`, updates)
      if (typeof response === 'string') {
        throw extractYumeError(response)
      }
      const { id: updatedId, data: updatedCategory } = response

      // 用真实数据替换本地数据
      set(categoryMapAtom, { [updatedId]: updatedCategory })
      set(categoryIdsAtom, { type: 'add', ids: [updatedId] })
      toast.success(`更新分类${originalCategory.name}成功`)
    }
    catch (error) {
      rollback()
      errorLogger(error)
      errorToaster(error)
    }
  },
)

// 乐观删除分类
export const optimisticRemoveCategoryAtom = atom(
  null,
  async (get, set, id: number) => {
    const originalCategoryMap = get(categoryMapAtom)
    const originalCategory = originalCategoryMap[id]
    const rollback = () => {
      set(categoryIdsAtom, { type: 'add', ids: [id] })
      set(categoryMapAtom, originalCategoryMap)
    }

    // 先乐观删除本地数据
    const { [id]: _removed, ...rest } = originalCategoryMap
    set(categoryIdsAtom, { type: 'remove', ids: [id] })
    set(categoryMapAtom, rest)

    try {
      if (!originalCategory) {
        throw createYumeError(new Error(`找不到ID为${id}的分类`), YumeErrorType.NotFoundError)
      }
      const response = await yumeFetchDelete<SingleDeleteData>(`/admin/categories/${id}`)
      if (typeof response === 'string') {
        throw extractYumeError(response)
      }
      if (!response.success) {
        throw createYumeError(new Error('删除失败'), YumeErrorType.BadRequestError)
      }
      toast.success('删除成功')
    }
    catch (error) {
      rollback()
      errorLogger(error)
      errorToaster(error)
    }
  },
)

// 获取分类详情
export const fetchCategoryDetailAtom = atom(
  null,
  async (get, set, id: number) => {
    const response = await yumeFetchGet<CategoryDetailResponse>(`/admin/categories/${id}`)
    if (typeof response === 'string') {
      throw extractYumeError(response)
    }
    const { data, objects } = response
    set(articleIdsAtom, { type: 'add', ids: data.articleIds })
    set(categoryIdToArticleIdsAtom, objects.categoryIdToArticleIds)
  },
)
