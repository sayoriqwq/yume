import type { Article, Category, Comment, Tag } from '@/generated'
import type { CommentForStore } from '@/types'
import { produce } from 'immer'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export interface DashboardStore {
  // 实体集合，映射关系
  entities: {
    articleMap: Record<number, Article>
    categoryMap: Record<number, Category>
    tagMap: Record<number, Tag>
    commentMap: Record<number, CommentForStore>
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
    articleIdToCommentsIds: Record<number, number[]>
    tagIdToArticleIds: Record<number, number[]>
    commentIdToRepliesIds: Record<number, number[]>
  }
  counts: {
    articlesTotal: number
    commentsTotal: number
  }
}

export type IdsUpdate =
  | { type: 'add', ids: number[] }
  | { type: 'remove', ids: number[] }
  | { type: 'set', ids: number[] }

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
    commentIdToRepliesIds: {},
    articleIdToCommentsIds: {},
  },
  counts: {
    articlesTotal: 0,
    commentsTotal: 0,
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

// counts
export const articlesTotalCountAtom = atom(
  get => get(dashboardStoreAtom).counts.articlesTotal,
  (get, set, count: number) => {
    set(dashboardStoreAtom, produce((store) => {
      store.counts.articlesTotal = count
    }))
  },
)

export const commentsTotalCountAtom = atom(
  get => get(dashboardStoreAtom).counts.commentsTotal,
  (get, set, count: number) => {
    set(dashboardStoreAtom, produce((store) => {
      store.counts.commentsTotal = count
    }))
  },
)

// relations
export const categoryIdToArticleIdsAtom = atom(
  get => get(dashboardStoreAtom).relations.categoryIdToArticleIds,
  (get, set, update: Record<number, number[]>) => {
    set(dashboardStoreAtom, produce((store) => {
      Object.assign(store.relations.categoryIdToArticleIds, update)
    }))
  },
)

export const articleIdToTagIdsAtom = atom(
  get => get(dashboardStoreAtom).relations.articleIdToTagIds,
  (get, set, update: Record<number, number[]>) => {
    set(dashboardStoreAtom, produce((store) => {
      Object.assign(store.relations.articleIdToTagIds, update)
    }))
  },
)

export const tagIdToArticleIdsAtom = atom(
  get => get(dashboardStoreAtom).relations.tagIdToArticleIds,
  (get, set, update: Record<number, number[]>) => {
    set(dashboardStoreAtom, produce((store) => {
      Object.assign(store.relations.tagIdToArticleIds, update)
    }))
  },
)

export const articleIdToCategoryIdAtom = atom(
  get => get(dashboardStoreAtom).relations.articleIdToCategoryId,
  (get, set, update: Record<number, number>) => {
    set(dashboardStoreAtom, produce((store) => {
      Object.assign(store.relations.articleIdToCategoryId, update)
    }))
  },
)

export const articleIdToCommentsIdsAtom = atom(
  get => get(dashboardStoreAtom).relations.articleIdToCommentsIds,
  (get, set, update: Record<number, number[]>) => {
    set(dashboardStoreAtom, produce((store) => {
      Object.assign(store.relations.articleIdToCommentsIds, update)
    }))
  },
)
export const commentIdToRepliesIdsAtom = atom(
  get => get(dashboardStoreAtom).relations.commentIdToRepliesIds,
  (get, set, update: Record<number, number[]>) => {
    set(dashboardStoreAtom, produce((store) => {
      Object.assign(store.relations.commentIdToRepliesIds, update)
    }))
  },
)

export const articleMapAtom = atom(
  get => get(dashboardStoreAtom).entities.articleMap,
  (get, set, update: Record<number, Article>) => {
    set(dashboardStoreAtom, produce((store) => {
      Object.assign(store.entities.articleMap, update)
    }))
  },
)

export const categoryMapAtom = atom(
  get => get(dashboardStoreAtom).entities.categoryMap,
  (get, set, update: Record<number, Category>) => {
    set(dashboardStoreAtom, produce((store) => {
      Object.assign(store.entities.categoryMap, update)
    }))
  },
)

export const tagMapAtom = atom(
  get => get(dashboardStoreAtom).entities.tagMap,
  (get, set, update: Record<number, Tag>) => {
    set(dashboardStoreAtom, produce((store) => {
      Object.assign(store.entities.tagMap, update)
    }))
  },
)

export const commentMapAtom = atom(
  get => get(dashboardStoreAtom).entities.commentMap,
  (get, set, update: Record<number, Comment>) => {
    set(dashboardStoreAtom, produce((store) => {
      Object.assign(store.entities.commentMap, update)
    }))
  },
)
