'server only'

import type { z } from 'zod'
import type { updateArticleSchema } from '../schema'
import prisma from '@/db/prisma'

export async function updateArticle(input: z.infer<typeof updateArticleSchema>, id: number) {
  const { title, content, cover, categoryId, tagIds, published, description } = input
  const article = await prisma.article.update({
    where: { id },
    data: {
      title,
      content,
      cover,
      categoryId,
      published,
      description,
      tags: {
        set: tagIds?.map(id => ({ id })) || [],
      },
    },
    include: {
      tags: true,
    },
  })
  return article
}
