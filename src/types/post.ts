export interface Post {
  metadata: IPostMetaData
  slug: string
  content: string
}

export interface IPostMetaData {
  id?: number
  title: string
  category: string
  cover: string
  createdAt: string
  updatedAt?: string
  published?: boolean
  tags?: string[]
  description?: string
}
