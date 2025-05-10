import type { ArticlesResponse, NormalizedArticle } from '@/atoms/dashboard/types'
import type { Article, Category, Comment, Tag } from '@/generated'

type ArticleInput = Article & {
  tags?: Tag[]
  category?: Category | null
  comments?: Comment[]
  _count?: { comments?: number, likes?: number }
}

export function normalizeArticle(article: ArticleInput): NormalizedArticle {
  const tagIds: number[] = []
  const commentIds: number[] = []

  if (article.tags && article.tags.length > 0) {
    article.tags.forEach(tag => tagIds.push(tag.id))
  }

  if (article.comments && article.comments.length > 0) {
    article.comments.forEach(comment => commentIds.push(comment.id))
  }

  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    description: article.description,
    cover: article.cover,
    type: article.type,
    viewCount: article.viewCount,
    content: article.content,
    mdxPath: article.mdxPath,
    mood: article.mood,
    weather: article.weather,
    location: article.location,
    categoryId: article.categoryId,
    published: article.published,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    // 主要是这些部分被特殊处理了
    tagIds,
    commentIds,
    likeCount: article._count?.likes || 0,
  }
}

export function normalizeArticles(articles: ArticleInput[]): ArticlesResponse {
  const categories: Record<number, Category> = {}
  const tags: Record<number, Tag> = {}
  const comments: Record<number, Comment> = {}

  const processedData = articles.map((article) => {
    if (article.category) {
      categories[article.category.id] = article.category
    }

    if (article.tags && article.tags.length > 0) {
      article.tags.forEach((tag) => {
        tags[tag.id] = tag
      })
    }

    if (article.comments && article.comments.length > 0) {
      article.comments.forEach((comment) => {
        comments[comment.id] = comment
      })
    }

    return normalizeArticle(article)
  })

  return {
    data: processedData,
    objects: {
      categories,
      tags,
      comments,
    },
  }
}
