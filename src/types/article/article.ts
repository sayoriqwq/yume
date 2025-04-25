// 前端展示用的文章类型
// 所有字段均必选，后->前应该配置默认值
export interface BaseArticle {
  id: number
  slug: string
  title: string
  description: string
  cover: string
  type: 'BLOG' | 'NOTE' | 'DRAFT'
  viewCount: number
  published: boolean
  createdAt: string
  updatedAt: string
  categoryId: number
  category: string
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
  tags: string[]
}

export type Article = Draft | Note | Blog
