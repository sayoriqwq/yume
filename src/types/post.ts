// 博客文章类型，from .mdx

export interface Post {
  metadata: IPostMetaData
  content: string
}

// from matter
export interface IPostMetaData {
  slug: string
  title: string
  category: string
  cover: string
  createdAt: string
  updatedAt?: string
  published?: boolean
  tags?: string[]
  description?: string
}
