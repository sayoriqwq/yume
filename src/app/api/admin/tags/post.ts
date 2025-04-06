import type { z } from 'zod'
import type { createTagSchema } from './schema'
import { db } from '@/db'

export async function createTag(input: z.infer<typeof createTagSchema>) {
  const { name } = input
  const tag = await db.tag.create({
    data: {
      name,
    },
  })
  return { tag }
}
