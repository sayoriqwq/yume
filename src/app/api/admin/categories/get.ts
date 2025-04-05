import type { z } from 'zod'
import type { categoryPaginationSchema } from './schema'
import { db } from '@/db'

export async function getCategories(
  input: z.infer<typeof categoryPaginationSchema>,
) {
  const { page, pageSize } = input
  const skip = (page - 1) * pageSize
  const [categories, count] = await Promise.all([
    db.category.findMany({
      skip,
      take: pageSize,
      include: {
        articles: {
          select: {
            id: true,
          },
        },
      },
    }),
    db.category.count(),
  ])
  return { categories, count }
}
