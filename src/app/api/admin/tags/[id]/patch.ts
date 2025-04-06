import type { z } from 'zod'
import type { updateTagSchema } from '../schema'
import { db } from '@/db'

export async function updateTag(input: z.infer<typeof updateTagSchema>, id: number) {
  const { name } = input
  const tag = await db.tag.update({
    where: { id },
    data: {
      name,
    },
  })

  return { tag }
}
