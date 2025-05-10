'use server'

import type { ApprovalStatus } from '@/generated'
import prisma from '@/db/prisma'

export async function getFriendLinks({
  status,
}: {
  status?: ApprovalStatus
} = {}) {
  // 构建查询条件
  const where: any = {}

  // 添加状态过滤
  if (status) {
    where.status = status
  }

  const [friendLinks, count] = await Promise.all([
    prisma.friendLink.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.friendLink.count({ where }),
  ])

  return {
    friendLinks,
    count,
  }
}
