import { db } from '@/db'

export async function getCategories() {
  const [categories, count] = await Promise.all([
    db.category.findMany({
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
