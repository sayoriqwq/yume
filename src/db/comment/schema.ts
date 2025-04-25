import { z } from 'zod'

export const CommentSchema = z.object({
  content: z.string().min(1, '评论不能为空').max(500, '评论长度不能超过500字符'),
  articleId: z.number(),
  parentId: z.number().nullable().optional(),
})

export type CommentSchemaType = z.infer<typeof CommentSchema>
