'server only'

import prisma from '@/db/prisma'
import { ApprovalStatus } from '@/generated'

export async function getComments({
  status,
}: {
  status?: string
} = {}) {
  // 构建查询条件
  const where: any = {}

  // 添加状态过滤
  if (status && Object.values(ApprovalStatus).includes(status as ApprovalStatus)) {
    where.status = status
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
        replies: {
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            likes: true,
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
      likesCount: comment._count.likes,
    })),
    count,
  }
}
