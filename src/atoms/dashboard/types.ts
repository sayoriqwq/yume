import type { Article, Category, Comment, Prisma, Tag } from '@/generated'

export type NormalizedArticle = Article & {
  tagIds: number[]
  commentIds: number[]
  likeCount: number
}
export type NormalizedCategory = Category & {
  articleIds: number[]
}

export type NormalizedTag = Tag & {
  articleIds: number[]
}

export type NormalizedComment = Prisma.CommentGetPayload<{ include: {
  author: {
    select: {
      id: true
      username: true
      image_url: true
    }
  }
} }> & {
  replyIds?: number[]
  likeCount?: number
}

export interface ArticlesResponse {
  data: NormalizedArticle[]
  // objects里放查出来的关联关系内容
  objects: {
    categories: Record<number, Category>
    tags: Record<number, Tag>
    comments: Record<number, Comment>
  }
}

export interface CategoriesResponse {
  data: NormalizedCategory[]
  objects: {
    articles: Record<number, Article>
  }
}

export interface TagsResponse {
  data: NormalizedTag[]
  objects: {
    articles: Record<number, Article>
  }
}

export interface CommentsResponse {
  data: NormalizedComment[]
  objects: {
    articles: Record<number, Article>
  }
}
