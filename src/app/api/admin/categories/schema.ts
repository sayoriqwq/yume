import { z } from 'zod'

const categoryBaseSchema = z.object({
  name: z.string().min(2, '分类名称至少需要 2 个字符').max(50, '分类名称最多 50 个字符'),
  cover: z.union([z.string().url('封面必须是有效的 URL'), z.literal('')]).optional().nullable(), // 允许为空字符串或 URL
})

export const categoryPaginationSchema = z.object({
  page: z.coerce.number().min(1).max(100),
  pageSize: z.coerce.number().min(1).max(100),
})

export const categoryDetailSchema = z.object({
  id: z.coerce.number().min(1),
})

export const categoryDeleteSchema = z.object({
  id: z.coerce.number().min(1),
})

export const createCategorySchema = categoryBaseSchema

export const updateCategorySchema = categoryBaseSchema.partial()
