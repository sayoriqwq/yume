import { ApprovalStatus } from '@/generated'
import { z } from 'zod'

export const commentBaseSchema = z.object({
  content: z.string().min(2, '评论内容至少需要2个字符').max(1000, '评论内容最多1000个字符'),
  articleId: z.number().optional(),
  parentId: z.number().optional(),
  authorId: z.string().optional(),
})

export const createCommentSchema = commentBaseSchema

export const updateCommentSchema = z.object({
  content: z.string().min(2, '评论内容至少需要2个字符').max(1000, '评论内容最多1000个字符').optional(),
  status: z.nativeEnum(ApprovalStatus).optional(),
  deleted: z.boolean().optional(),
})

export const commentListSchema = z.object({
  status: z.nativeEnum(ApprovalStatus).optional(),
})
