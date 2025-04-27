import prisma from '@/db/prisma'

export async function getTags() {
  const [tags, count] = await Promise.all([
    prisma.tag.findMany({
      include: {
        articles: {
          select: {
            id: true,
          },
        },
      },
    }),
    prisma.tag.count(),
  ])
  return { tags, count }
}
