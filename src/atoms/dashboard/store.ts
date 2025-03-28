import type { Article, Category, Comment, Tag } from './types'
import { produce } from 'immer'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { updateEntities, updateIds, updateRelations } from './helpers'

export interface DashboardStore {
  // 实体集合，映射关系
  entities: {
    articleMap: Record<number, Article>
    categoryMap: Record<number, Category>
    tagMap: Record<number, Tag>
    commentMap: Record<number, Comment>
  }
  // 实体ID列表，实际操作的数据
  ids: {
    articleIds: number[]
    categoryIds: number[]
    tagIds: number[]
    commentIds: number[]
  }
  // 实体间关系
  relations: {
    categoryIdToArticleIds: Record<number, number[]>
    articleIdToCategoryId: Record<number, number>
    articleIdToTagIds: Record<number, number[]>
    tagIdToArticleIds: Record<number, number[]>
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
  relations: {
    categoryIdToArticleIds: {},
    articleIdToCategoryId: {},
    articleIdToTagIds: {},
    tagIdToArticleIds: {},
  },
}

// 创建持久化的根存储
export const dashboardStoreAtom = atomWithStorage<DashboardStore>(
  'dashboard-store',
  initialStore,
)

export const articleIdsAtom = atom(
  get => get(dashboardStoreAtom).ids.articleIds,
  (get, set, update: number[]) => {
    set(dashboardStoreAtom, produce((draft) => {
      draft.ids.articleIds = updateIds(draft.ids.articleIds, update)
    }))
  },
)

export const categoryIdsAtom = atom(
  get => get(dashboardStoreAtom).ids.categoryIds,
  (get, set, update: number[]) => {
    set(dashboardStoreAtom, produce((draft) => {
      draft.ids.categoryIds = update
    }))
  },
)

export const tagIdsAtom = atom(
  get => get(dashboardStoreAtom).ids.tagIds,
  (get, set, update: number[]) => {
    set(dashboardStoreAtom, produce((draft) => {
      draft.ids.tagIds = updateIds(draft.ids.tagIds, update)
    }))
  },
)

export const articleMapAtom = atom(
  get => get(dashboardStoreAtom).entities.articleMap,
  (get, set, update: Record<number, Article>) => {
    set(dashboardStoreAtom, produce((draft) => {
      draft.entities.articleMap = updateEntities(draft.entities.articleMap, update)
    }))
  },
)

export const categoryMapAtom = atom(
  get => get(dashboardStoreAtom).entities.categoryMap,
  (get, set, update: Record<number, Category>) => {
    set(dashboardStoreAtom, produce((draft) => {
      draft.entities.categoryMap = updateEntities(draft.entities.categoryMap, update)
    }))
  },
)

export const tagMapAtom = atom(
  get => get(dashboardStoreAtom).entities.tagMap,
  (get, set, update: Record<number, Tag>) => {
    set(dashboardStoreAtom, produce((draft) => {
      draft.entities.tagMap = updateEntities(draft.entities.tagMap, update)
    }))
  },
)

export const commentMapAtom = atom(
  get => get(dashboardStoreAtom).entities.commentMap,
  (get, set, update: Record<number, Comment>) => {
    set(dashboardStoreAtom, produce((draft) => {
      draft.entities.commentMap = updateEntities(draft.entities.commentMap, update)
    }))
  },
)

export const categoryIdToArticleIdsAtom = atom(
  get => get(dashboardStoreAtom).relations.categoryIdToArticleIds,
  (get, set, update: Record<number, number[]>) => {
    set(dashboardStoreAtom, produce((draft) => {
      draft.relations.categoryIdToArticleIds = updateRelations(draft.relations.categoryIdToArticleIds, update)
    }))
  },
)

export const articleIdToTagIdsAtom = atom(
  get => get(dashboardStoreAtom).relations.articleIdToTagIds,
  (get, set, update: Record<number, number[]>) => {
    set(dashboardStoreAtom, produce((draft) => {
      draft.relations.articleIdToTagIds = updateRelations(draft.relations.articleIdToTagIds, update)
    }))
  },
)

export const tagIdToArticleIdsAtom = atom(
  get => get(dashboardStoreAtom).relations.tagIdToArticleIds,
  (get, set, update: Record<number, number[]>) => {
    set(dashboardStoreAtom, produce((draft) => {
      draft.relations.tagIdToArticleIds = updateRelations(draft.relations.tagIdToArticleIds, update)
    }))
  },
)

export const articleIdToCategoryIdAtom = atom(
  get => get(dashboardStoreAtom).relations.articleIdToCategoryId,
  (get, set, update: Record<number, number>) => {
    set(dashboardStoreAtom, produce((draft) => {
      draft.relations.articleIdToCategoryId = update
    }))
  },
)
