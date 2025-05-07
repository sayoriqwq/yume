'server only'

import type { z } from 'zod'
import type { createCommentSchema } from './schema'
import prisma from '@/db/prisma'
import { ApprovalStatus } from '@/generated'

export async function createComment(input: z.infer<typeof createCommentSchema>) {
  const { content, articleId, parentId, authorId } = input

  if (!articleId) {
    throw new Error('文章ID不能为空')
  }

  if (!authorId) {
    throw new Error('作者ID不能为空')
  }

  // 创建评论
  const comment = await prisma.comment.create({
    data: {
      content,
      articleId,
      authorId,
      parentId: parentId || null,
      status: ApprovalStatus.PENDING, // 默认新评论需要审核
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          image_url: true,
        },
      },
      article: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
      likes: {
        select: {
          id: true,
          userId: true,
        },
      },
      _count: {
        select: {
          replies: true,
        },
      },
    },
  })

  return {
    comment: {
      ...comment,
      likesCount: 0,
      repliesCount: 0,
    },
  }
}
