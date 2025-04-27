'server only'

import { createYumeError, YumeErrorType } from '@/lib/YumeError'
import prisma from '../prisma'

/**
 * 获取文章评论，四层
 * 前端构建更消耗性能
 */
export async function getArticleComments(articleId: number) {
  const comments = await prisma.comment.findMany({
    where: {
      articleId,
      parentId: null,
      status: 'APPROVED',
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          image_url: true,
        },
      },
      replies: { // 第二层
        where: { status: 'APPROVED' },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              image_url: true,
            },
          },
          replies: { // 第三层
            where: { status: 'APPROVED' },
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  image_url: true,
                },
              },
              replies: { // 第四层
                where: { status: 'APPROVED' },
                include: {
                  author: {
                    select: {
                      id: true,
                      username: true,
                      image_url: true,
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

  return comments
}

export async function getCommentCount(articleId: number) {
  const count = await prisma.comment.count({
    where: {
      articleId,
      status: 'APPROVED',
    },
  })
  console.log('评论数量:', count)
  return count
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

export async function getCommentById(id: number) {
  const comment = await prisma.comment.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          image_url: true,
        },
      },
      replies: {
        where: { status: 'APPROVED' },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              image_url: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  return comment
}
