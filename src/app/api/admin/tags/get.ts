import { db } from '@/db'

export async function getTags() {
  const [tags, count] = await Promise.all([
    db.tag.findMany({
      include: {
        articles: {
          select: {
            id: true,
          },
        },
      },
    }),
    db.tag.count(),
  ])
  return { tags, count }
}
