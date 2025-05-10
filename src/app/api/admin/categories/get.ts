'server only'

import prisma from '@/db/prisma'

export async function getCategories() {
  const categories = await prisma.category.findMany({
    include: {
      articles: true,
    },
  })
  return categories
}
