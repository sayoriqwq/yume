import { z } from 'zod'

export const LikeSchema = z.object({
  type: z.enum(['ARTICLE', 'COMMENT']),
  targetId: z.number().int().positive(),
})

export type Like = z.infer<typeof LikeSchema>
