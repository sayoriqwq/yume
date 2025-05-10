import type { CommentWithAuthor } from '@/types'
import type { NormalizedArticle, NormalizedCategory, NormalizedComment, NormalizedTag } from './types'
import { produce } from 'immer'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export type IdsUpdate =
  | { type: 'add', ids: number[] }
  | { type: 'remove', ids: number[] }
  | { type: 'set', ids: number[] }
export interface DashboardStore {
  // 实体集合，映射关系
  entities: {
    articleMap: Record<number, NormalizedArticle>
    categoryMap: Record<number, NormalizedCategory>
    tagMap: Record<number, NormalizedTag>
    commentMap: Record<number, NormalizedComment>
  }
  // 实体ID列表，实际操作的数据
  ids: {
    articleIds: number[]
    categoryIds: number[]
    tagIds: number[]
    commentIds: number[]
  }
}

const initialStore: DashboardStore = {
  entities: {
    articleMap: {},
    categoryMap: {},
    tagMap: {},
    commentMap: {},
  },
  ids: {
    articleIds: [],
    categoryIds: [],
    tagIds: [],
    commentIds: [],
  },
}

// 创建持久化的根存储
export const dashboardStoreAtom = atomWithStorage<DashboardStore>(
  'dashboard-store',
  initialStore,
)

function handleIdsUpdate(currentIds: number[], update: IdsUpdate): number[] {
  const idsToUpdate = Array.isArray(update.ids) ? update.ids : [update.ids]

  switch (update.type) {
    case 'add':
      return [...new Set([...currentIds, ...idsToUpdate])]
    case 'remove':
      return currentIds.filter((id: number) => !idsToUpdate.includes(id))
    case 'set':
      return idsToUpdate
    default:
      return currentIds
  }
}

// ids
export const articleIdsAtom = atom(
  get => get(dashboardStoreAtom).ids.articleIds,
  (get, set, update: IdsUpdate) => {
    set(dashboardStoreAtom, produce((store) => {
      store.ids.articleIds = handleIdsUpdate(store.ids.articleIds, update)
    }))
  },
)

export const categoryIdsAtom = atom(
  get => get(dashboardStoreAtom).ids.categoryIds,
  (get, set, update: IdsUpdate) => {
    set(dashboardStoreAtom, produce((store) => {
      store.ids.categoryIds = handleIdsUpdate(store.ids.categoryIds, update)
    }))
  },
)

export const tagIdsAtom = atom(
  get => get(dashboardStoreAtom).ids.tagIds,
  (get, set, update: IdsUpdate) => {
    set(dashboardStoreAtom, produce((store) => {
      store.ids.tagIds = handleIdsUpdate(store.ids.tagIds, update)
    }))
  },
)

export const commentIdsAtom = atom(
  get => get(dashboardStoreAtom).ids.commentIds,
  (get, set, update: IdsUpdate) => {
    set(dashboardStoreAtom, produce((store) => {
      store.ids.commentIds = handleIdsUpdate(store.ids.commentIds, update)
    }))
  },
)

export const articleMapAtom = atom(
  get => get(dashboardStoreAtom).entities.articleMap,
  (get, set, update: Record<number, Partial<NormalizedArticle>>) => {
    set(dashboardStoreAtom, produce((store) => {
      for (const [idStr, articleData] of Object.entries(update)) {
        const id = Number(idStr)
        if (store.entities.articleMap[id]) {
          store.entities.articleMap[id] = {
            ...store.entities.articleMap[id],
            ...articleData,
          }
        }
        else {
          store.entities.articleMap[id] = articleData
        }
      }
    }))
  },
)

export const categoryMapAtom = atom(
  get => get(dashboardStoreAtom).entities.categoryMap,
  (get, set, update: Record<number, Partial<NormalizedCategory>>) => {
    set(dashboardStoreAtom, produce((store) => {
      for (const [idStr, categoryData] of Object.entries(update)) {
        const id = Number(idStr)
        if (store.entities.categoryMap[id]) {
          store.entities.categoryMap[id] = {
            ...store.entities.categoryMap[id],
            ...categoryData,
          }
        }
        else {
          store.entities.categoryMap[id] = categoryData
        }
      }
    }))
  },
)

export const tagMapAtom = atom(
  get => get(dashboardStoreAtom).entities.tagMap,
  (get, set, update: Record<number, Partial<NormalizedTag>>) => {
    set(dashboardStoreAtom, produce((store) => {
      for (const [idStr, tagData] of Object.entries(update)) {
        const id = Number(idStr)
        if (store.entities.tagMap[id]) {
          store.entities.tagMap[id] = {
            ...store.entities.tagMap[id],
            ...tagData,
          }
        }
        else {
          store.entities.tagMap[id] = tagData
        }
      }
    }))
  },
)

export const commentMapAtom = atom(
  get => get(dashboardStoreAtom).entities.commentMap,
  (get, set, update: Record<number, Partial<CommentWithAuthor>>) => {
    set(dashboardStoreAtom, produce((store) => {
      for (const [idStr, commentData] of Object.entries(update)) {
        const id = Number(idStr)
        if (store.entities.commentMap[id]) {
          store.entities.commentMap[id] = {
            ...store.entities.commentMap[id],
            ...commentData,
          }
        }
        else {
          store.entities.commentMap[id] = commentData
        }
      }
    }))
  },
)
