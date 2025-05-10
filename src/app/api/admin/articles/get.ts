'server only'

import type { ArticleType } from '@/generated'
import prisma from '@/db/prisma'

export async function getArticles(type?: ArticleType) {
  return await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
    where: type ? { type } : undefined,
    include: {
      category: true,
      tags: true,
      comments: true,
      _count: {
        select: {
          likes: true,
        },
      },
    },
  })
}
