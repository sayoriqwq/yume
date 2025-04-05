import type { z } from 'zod'
import type { updateCategorySchema } from '../schema'
import { db } from '@/db'

export async function updateCategory(input: z.infer<typeof updateCategorySchema>, id: number) {
  const { name, cover } = input
  const category = await db.category.update({
    where: { id },
    data: {
      name,
      cover,
    },
  })

  return { category }
}
