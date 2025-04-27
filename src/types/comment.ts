import type { ApprovalStatus } from '@/generated'

/**
 * 评论作者基本信息
 */
export interface CommentAuthor {
  id: string
  username: string
  image_url: string | null
}

/**
 * 带有作者和回复的评论类型
 */
export interface CommentWithAuthor {
  id: number
  content: string
  articleId: number
  parentId: number | null
  authorId: string
  author: CommentAuthor
  status: ApprovalStatus
  createdAt: Date
  updatedAt: Date
  deleted?: boolean
  replies?: CommentWithAuthor[] // 递归类型，用于嵌套回复
}

/**
 * 用于乐观更新的评论操作
 */
export type CommentAction =
  | { type: 'add', comment: CommentWithAuthor }
  | { type: 'delete', id: number }
  | { type: 'set', comments: CommentWithAuthor[] }

/**
 * 创建评论的请求数据
 */
export interface CreateCommentData {
  content: string
  articleId: number
  parentId?: number | null
}

/**
 * 评论API响应
 */
export interface CommentResponse {
  success: boolean
  comment?: CommentWithAuthor
  id?: number
  message?: string
}

/**
 * 获取评论的过滤参数
 */
export interface CommentFilter {
  articleId: number
  page?: number
  limit?: number
  status?: ApprovalStatus
}
