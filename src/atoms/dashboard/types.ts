// 实体基础接口
export interface Entity {
  id: number
}

// 分类实体
export interface Category extends Entity {
  name: string
  cover?: string | null
  count: number
}

// 标签实体
export interface Tag extends Entity {
  name: string
  count: number
}

// 评论实体
export interface Comment extends Entity {
  content: string
  authorId: string
  articleId?: number
  parentId?: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  updatedAt: string
}

// 文章实体
export interface Article extends Entity {
  title: string
  content: string | null
  categoryId: number
  createdAt: Date
  slug: string
  description?: string | null
  cover?: string | null
  type: ArticleType
  viewCount: number
  published: boolean
  // 关联数据（可能来自于API响应的附加信息）
  category?: Category
  tags?: Tag[]
}

export type ArticleType = 'BLOG' | 'NOTE' | 'DRAFT'

// API响应接口
export interface NormalizedResponse<T = Entity> {
  data: {
    [key: string]: number[]
  }
  objects: {
    [key: string]: Record<number, T>
  }
}
