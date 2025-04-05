import type { z } from 'zod'
import type { updateArticleSchema } from '../schema'
import { db } from '@/db'

export async function updateArticle(input: z.infer<typeof updateArticleSchema>, id: number) {
  const { title, content, cover, categoryId, tagIds } = input
  const article = await db.article.update({
    where: { id },
    data: {
      title,
      content,
      cover,
      categoryId,
      tags: {
        set: tagIds?.map(id => ({ id })) || [],
      },
    },
  })
  return { article }
}
