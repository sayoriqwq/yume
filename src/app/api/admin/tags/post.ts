import type { z } from 'zod'
import type { createTagSchema } from './schema'
import prisma from '@/db/prisma'

export async function createTag(input: z.infer<typeof createTagSchema>) {
  const { name } = input
  const tag = await prisma.tag.create({
    data: {
      name,
    },
  })
  return { tag }
}
