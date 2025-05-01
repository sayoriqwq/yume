'server only'

import type { CommentWithAuthor } from '@/types/comment'
import { createYumeError, YumeErrorType } from '@/lib/YumeError'
import prisma from '../prisma'

// 评论作者选择字段，统一提取避免重复
const authorSelect = {
  id: true,
  username: true,
  image_url: true,
}

// 点赞用户选择字段
const likeUserSelect = {
  id: true,
  username: true,
  image_url: true,
}

/**
 * 获取文章评论，四层，包含点赞信息
 * @param articleId 文章ID
 * @param userId 当前用户ID，用于判断是否已点赞
 */
export async function getArticleComments(articleId: number, userId?: string | null) {
  const comments = await prisma.comment.findMany({
    where: {
      articleId,
      parentId: null,
      status: 'APPROVED',
    },
    include: {
      author: {
        select: authorSelect,
      },
      likes: {
        include: {
          user: {
            select: likeUserSelect,
          },
        },
      },
      replies: { // 第二层
        where: { status: 'APPROVED' },
        include: {
          author: {
            select: authorSelect,
          },
          likes: {
            include: {
              user: {
                select: likeUserSelect,
              },
            },
          },
          replies: { // 第三层
            where: { status: 'APPROVED' },
            include: {
              author: {
                select: authorSelect,
              },
              likes: {
                include: {
                  user: {
                    select: likeUserSelect,
                  },
                },
              },
              replies: { // 第四层
                where: { status: 'APPROVED' },
                include: {
                  author: {
                    select: authorSelect,
                  },
                  likes: {
                    include: {
                      user: {
                        select: likeUserSelect,
                      },
                    },
                  },
                },
                orderBy: { createdAt: 'asc' },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  // 处理点赞信息，添加likeCount和hasLiked字段
  const processComments = (commentsData: any[]): CommentWithAuthor[] => {
    return commentsData.map((comment) => {
      // 计算点赞数
      const likeCount = comment.likes.length

      // 检查当前用户是否已点赞
      const hasLiked = userId
        ? comment.likes.some((like: any) => like.userId === userId)
        : false

      // 处理嵌套回复
      let replies = comment.replies
      if (replies?.length) {
        replies = processComments(replies)
      }

      return {
        ...comment,
        likeCount,
        hasLiked,
        replies,
      }
    })
  }

  return processComments(comments)
}

export async function getCommentCount(articleId: number) {
  return prisma.comment.count({
    where: {
      articleId,
      status: 'APPROVED',
    },
  })
}

/**
 * 添加评论
 */
export async function addComment(
  userId: string,
  articleId: number,
  content: string,
  parentId?: number,
) {
  return prisma.comment.create({
    data: {
      content,
      authorId: userId,
      articleId,
      parentId,
      status: 'APPROVED',
    },
  })
}

/**
 * 删除评论
 */
export async function deleteComment(id: number, userId: string) {
  const comment = await prisma.comment.findUnique({
    where: { id },
  })

  if (!comment) {
    throw createYumeError(new Error('评论不存在'), YumeErrorType.NotFoundError)
  }

  if (comment.authorId !== userId) {
    throw createYumeError(new Error('无权删除此评论'), YumeErrorType.ForbiddenError)
  }

  // 直接删除评论，Prisma 会自动处理子评论的 parentId 设置
  return prisma.comment.delete({
    where: { id },
  })
}
