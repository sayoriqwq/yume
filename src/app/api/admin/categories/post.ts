'server only'

import type { z } from 'zod'
import type { createCategorySchema } from './schema'
import prisma from '@/db/prisma'

export async function createCategory(input: z.infer<typeof createCategorySchema>) {
  const { name, cover } = input
  const category = await prisma.category.create({
    data: {
      name,
      cover,
    },
  })

  return { category }
}
