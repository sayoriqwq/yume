import type { ArticleType } from '@prisma/client'
import { db } from '@/db'

export async function getArticles(type?: ArticleType) {
  const [articles, count] = await Promise.all([
    db.article.findMany({
      orderBy: { createdAt: 'desc' },
      where: type ? { type } : undefined,
      include: {
        tags: true,
      },
    }),
    db.article.count(),
  ])
  return { articles, count }
}
