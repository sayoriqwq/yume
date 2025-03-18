import type { Comment, User } from '@prisma/client'

export type CommentWithAuthor = Omit<Comment, 'replies'> & {
  author: Partial<User>
  replies: CommentWithAuthor[]
}

export interface CommentState {
  success: boolean
  message: string
}

export interface CreateCommentData {
  content: string
  articleId: number
  parentId?: number | null
}

export interface DeleteCommentData {
  id: number
}
