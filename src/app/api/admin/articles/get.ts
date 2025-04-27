'server only'

import type { ArticleType } from '@/generated'
import prisma from '@/db/prisma'

export async function getArticles(type?: ArticleType) {
  const [articles, count] = await Promise.all([
    prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
      where: type ? { type } : undefined,
      include: {
        tags: true,
      },
    }),
    prisma.article.count(),
  ])
  return { articles, count }
}
