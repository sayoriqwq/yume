import { z } from 'zod'

// 文章列表查询参数验证
export const articleListQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  type: z.enum(['BLOG', 'NOTE', 'DRAFT']).optional(),
  categoryId: z.coerce.number().optional(),
  tag: z.string().optional(),
  search: z.string().optional(),
})

// 文章详情查询参数验证
export const articleDetailQuerySchema = z.object({
  slug: z.string().optional(),
  id: z.coerce.number().optional(),
}).refine(data => data.slug || data.id, {
  message: '必须提供 slug 或 id',
})

// 文章评论请求体验证
export const createCommentSchema = z.object({
  content: z.string().min(1, '评论内容不能为空'),
  parentId: z.number().optional(),
})

// 文章点赞请求体验证
export const likeArticleSchema = z.object({
  articleId: z.number(),
})

// 用于类型定义
export type ArticlesFilter = z.infer<typeof articleListQuerySchema> & {
  published?: boolean
}
