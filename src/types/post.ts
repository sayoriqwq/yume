export interface Post {
  id?: number
  metadata: IPostMetaData
  slug: string
  content: string
}

export interface IPostMetaData {
  title: string
  category: string
  cover: string
  createdAt: string
  updatedAt?: string
  published?: boolean
  tags?: string[]
  description?: string
}
