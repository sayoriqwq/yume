import type { z } from 'zod'
import type { updateCategorySchema } from '../schema'
import prisma from '@/db/prisma'

export async function updateCategory(input: z.infer<typeof updateCategorySchema>, id: number) {
  const { name, cover } = input
  const category = await prisma.category.update({
    where: { id },
    data: {
      name,
      cover,
    },
  })

  return { category }
}
