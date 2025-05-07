'server only'

import prisma from '@/db/prisma'
import { ApprovalStatus } from '@/generated'

export async function getComments({
  status,
  articleId,
}: {
  status?: string
  articleId?: number
} = {}) {
  // 构建查询条件
  const where: any = {}

  // 添加状态过滤
  if (status && Object.values(ApprovalStatus).includes(status as ApprovalStatus)) {
    where.status = status
  }

  // 添加文章ID过滤
  if (articleId) {
    where.articleId = articleId
  }

  const [comments, count] = await Promise.all([
    prisma.comment.findMany({
      where,
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
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.comment.count({ where }),
  ])

  return {
    comments: comments.map(comment => ({
      ...comment,
      likesCount: comment.likes.length,
      repliesCount: comment._count.replies,
    })),
    count,
  }
}
