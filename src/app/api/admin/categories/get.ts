import prisma from '@/db/prisma'

export async function getCategories() {
  const [categories, count] = await Promise.all([
    prisma.category.findMany({
      include: {
        articles: {
          select: {
            id: true,
          },
        },
      },
    }),
    prisma.category.count(),
  ])
  return { categories, count }
}
