import { z } from 'zod'

const tagBaseSchema = z.object({
  name: z.string().min(2, '标签名称至少需要 2 个字符').max(50, '标签名称最多 50 个字符'),
})

export const createTagSchema = tagBaseSchema

export const updateTagSchema = tagBaseSchema.partial()
