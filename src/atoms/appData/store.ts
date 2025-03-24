import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export interface User {
  id: string
  username: string
  email?: string
  image_url?: string
}

export interface Article {
  id: number
  slug: string
  title: string
  description?: string
  cover?: string
  type: 'BLOG' | 'NOTE' | 'DRAFT'
  viewCount: number
  content?: string
  mood?: string
  weather?: string
  location?: string
  categoryId: number
  category: string
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: number
  name: string
  cover?: string
  count: number
}

export interface Tag {
  id: number
  name: string
  count: number
}

export interface Comment {
  id: number
  content: string
  authorId: string
  articleId?: number
  parentId?: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  updatedAt: string
}

// 集合类型
export type Collection<T> = Record<string | number, T>

// 根状态结构
export interface RootState {
  users: Collection<User>
  articles: Collection<Article>
  categories: Collection<Category>
  tags: Collection<Tag>
  comments: Collection<Comment>
  articleTags: Record<number, number[]> // articleId -> tagIds
}

// 初始化空集合
const initialState: RootState = {
  users: {},
  articles: {},
  categories: {},
  tags: {},
  comments: {},
  articleTags: {},
}

// 根存储atom (在localStorage中持久化)
export const storeAtom = atomWithStorage<RootState>('appData', initialState)

function createFilteredSetter(key: keyof RootState) {
  return (get: any, set: any, update: Partial<any>) => {
    const filteredUpdate: any = {}
    for (const k in update) {
      if (update[k] !== undefined) {
        filteredUpdate[k] = update[k]
      }
    }

    set(storeAtom, (prev: RootState) => ({
      ...prev,
      [key]: { ...prev[key], ...filteredUpdate },
    }))
  }
}
// 为每种实体类型创建选择器atom
export const usersAtom = atom(
  get => get(storeAtom).users,
  createFilteredSetter('users'),
)

export const articlesAtom = atom(
  get => get(storeAtom).articles,
  createFilteredSetter('articles'),
)

export const categoriesAtom = atom(
  get => get(storeAtom).categories,
  createFilteredSetter('categories'),
)

export const tagsAtom = atom(
  get => get(storeAtom).tags,
  createFilteredSetter('tags'),
)

export const commentsAtom = atom(
  get => get(storeAtom).comments,
  createFilteredSetter('comments'),
)

export const articleTagsAtom = atom(
  get => get(storeAtom).articleTags,
  createFilteredSetter('articleTags'),
)
