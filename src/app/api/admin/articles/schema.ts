import { z } from 'zod'

export const articlePaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(10),
  type: z.enum(['BLOG', 'DRAFT', 'NOTE']).optional(),
})

export const baseCreateArticleSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  content: z.string().optional().default(''),
  description: z.string().optional().nullable(),
  cover: z.string().optional().nullable(),
  published: z.boolean().optional().default(false),
  categoryId: z.number().int().optional(),
})

export const createDraftSchema = baseCreateArticleSchema.extend({
  tagIds: z.array(z.number().int()).optional(),
})

export const createNoteSchema = baseCreateArticleSchema.extend({
  mood: z.string().optional().nullable(),
  weather: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
})

export const createArticleSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  content: z.string().optional().default(''),
  description: z.string().optional().nullable(),
  cover: z.string().optional().nullable(),
  published: z.boolean().optional().default(false),
  categoryId: z.number().int(),
  type: z.enum(['BLOG', 'DRAFT', 'NOTE']),
  // DRAFT & BLOG
  tagIds: z.array(z.number().int()).optional().default([]),
  // NOTE
  mood: z.string().optional().nullable(),
  weather: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
})

export const updateArticleSchema = createArticleSchema.partial()
