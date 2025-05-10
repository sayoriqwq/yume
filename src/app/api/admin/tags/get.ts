'server only'

import prisma from '@/db/prisma'

export async function getTags() {
  const tags = await prisma.tag.findMany({
    include: {
      articles: true,
    },
  })
  return tags
}
