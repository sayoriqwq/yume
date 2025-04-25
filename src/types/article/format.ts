import type { Prisma } from '@/generated'
import type { Article, Blog, Draft, Note } from './article'

export function formatArticle<T extends Article>(
  article: Prisma.ArticleGetPayload<{
    include: {
      category: true
      tags: true
    }
  }>,
  expectedType?: T,
): T extends Draft ? Draft : T extends Note ? Note : T extends Blog ? Blog : Article {
  // 提取通用字段
  const baseArticle = {
    id: article.id,
    slug: article.slug,
    title: article.title,
    description: article.description || '',
    cover: article.cover || '',
    viewCount: article.viewCount || 0,
    published: article.published,
    createdAt: new Date(article.createdAt).toLocaleString('zh-CN'),
    updatedAt: new Date(article.updatedAt).toLocaleString('zh-CN'),
    categoryId: article.categoryId,
    category: article.category.name,
  }

  // 使用传入的expectedType或文章自身的type
  const type = expectedType || article.type

  // 根据类型返回不同的格式
  switch (type) {
    case 'DRAFT':
      return {
        ...baseArticle,
        type: 'DRAFT',
        content: article.content || '',
      } as any // 使用any绕过类型检查

    case 'NOTE':
      return {
        ...baseArticle,
        type: 'NOTE',
        content: article.content || '',
        mood: article.mood || '',
        weather: article.weather || '',
        location: article.location || '',
      } as any

    case 'BLOG':
    default:
      return {
        ...baseArticle,
        type: 'BLOG',
        tags: article.tags?.map(tag => tag.name) || [],
      } as any
  }
}
