import type { z } from 'zod'
import type { createCategorySchema } from './schema'
import { db } from '@/db'

export async function createCategory(input: z.infer<typeof createCategorySchema>) {
  const { name, cover } = input
  const category = await db.category.create({
    data: {
      name,
      cover,
    },
  })

  return { category }
}
