export interface Post {
  metadata: IPostMetaData
  slug: string
  content: string
}

export interface IPostMetaData {
  id: number
  title: string
  category: string
  cover: string
  publishedAt: string
  published?: boolean
  tags?: string[]
  summary?: string
}

export interface ITag {
  name: string
  count: number
}
