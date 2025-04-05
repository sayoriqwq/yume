import type { z } from 'zod'
import type { articlePaginationSchema } from './schema'
import { db } from '@/db'

export async function getArticles(input: z.infer<typeof articlePaginationSchema>) {
  const { page, pageSize, type } = input
  const skip = (page - 1) * pageSize
  const [articles, count] = await Promise.all([
    db.article.findMany({
      skip,
      take: pageSize,
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
