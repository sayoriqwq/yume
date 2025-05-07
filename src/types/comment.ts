import type { Prisma, User } from '@/generated'

/**
 * 评论作者基本信息
 */
export type CommentAuthor = Pick<User, 'id' | 'username' | 'image_url'>

/**
 * 点赞用户基本信息
 */
export interface LikeUser {
  id: string
  username: string
  image_url: string | null
}

/**
 * 评论点赞信息
 */
export interface CommentLike {
  id: number
  userId: string
  user: LikeUser
}

/**
 * 带有作者和回复的评论类型
 */
export type CommentWithAuthor = Prisma.CommentGetPayload<{ include: {
  author: {
    select: {
      id: true
      username: true
      image_url: true
    }
  }
  likes: {
    include: {
      user: {
        select: {
          id: true
          username: true
          image_url: true
        }
      }
    }
  }
} }> & {
  replies?: CommentWithAuthor[]
  likeCount?: number
  hasLiked?: boolean
}

/**
 * 用于乐观更新的评论操作
 */
export type CommentAction =
  | { type: 'add', comment: CommentWithAuthor }
  | { type: 'delete', id: number }
  | { type: 'set', comments: CommentWithAuthor[] }

/**
 * 评论表单数据
 */
export interface CommentFormData {
  content: string
  articleId: number
  parentId?: number | null
}

/**
 * 评论服务操作参数
 */
export interface CommentActionParams {
  content: string
  articleId: number
  parentId?: number | null
  path: string
  userId: string
}

/**
 * 删除评论参数
 */
export interface DeleteCommentParams {
  id: number
  path: string
  userId: string
}

/**
 * 评论状态信息
 */
export type CommentStatus = [CommentWithAuthor[], number]

export type CommentForStore = Prisma.CommentGetPayload<{ include: {
  author: {
    select: {
      id: true
      username: true
      image_url: true
    }
  }
  likes: {
    include: {
      user: {
        select: {
          id: true
          username: true
          image_url: true
        }
      }
    }
  }
  _count: {
    select: {
      likes: true
      replies: true
    }
  }
} }> & {
  replies?: CommentForStore[]
}
