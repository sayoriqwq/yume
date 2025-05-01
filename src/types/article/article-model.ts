// 后端文章类型
import type { Article as ArticleModel, Prisma } from '@/generated'

export type Draft = Omit<ArticleModel, 'type' | 'mood' | 'weather' | 'location' | 'mdxPath'>

export type Note = Omit<ArticleModel, 'type' | 'tags' | 'mdxPath'>

export type Blog = Omit<ArticleModel, 'type' | 'mood' | 'weather' | 'location'>

export type ArticleWithTags = Prisma.ArticleGetPayload<{
  include: {
    tags: true
  }
}>

export type ArticleWithCategory = Prisma.ArticleGetPayload<{
  include: {
    category: true
  }
}>

export type ArticleWithAllMetadata = Prisma.ArticleGetPayload<{
  include: {
    category: true
    tags: true
    _count: {
      select:
      {
        likes: true
        comments: {
          where: { status: 'APPROVED' }
        }
      }
    }
  }
}>
