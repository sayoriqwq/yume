export interface BaseArticle {
  id: number
  slug: string
  title: string
  description?: string
  cover?: string
  type: 'BLOG' | 'NOTE' | 'DRAFT'
  viewCount: number
  published: boolean
  createdAt: string
  updatedAt: string
  categoryId: number
}

export interface Draft extends BaseArticle {
  type: 'DRAFT'
  content: string
}

export interface Note extends BaseArticle {
  type: 'NOTE'
  content: string
  mood: string
  weather: string
  location: string
}

export interface Blog extends BaseArticle {
  type: 'BLOG'
  category: Category
  tags: Tag[]
}

export type Article = Draft | Note | Blog

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
