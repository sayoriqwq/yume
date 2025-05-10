'use server'

import type { z } from 'zod'
import type { updateFriendLinkSchema } from '../schema'
import prisma from '@/db/prisma'
import { createYumeError, YumeErrorType } from '@/lib/YumeError'

export async function updateFriendLink(input: z.infer<typeof updateFriendLinkSchema>, id: number) {
  // 检查友链是否存在
  const existingFriendLink = await prisma.friendLink.findUnique({
    where: { id },
  })

  if (!existingFriendLink) {
    throw createYumeError(`ID为${id}的友链不存在`, YumeErrorType.NotFoundError)
  }

  // 更新友链
  const updatedFriendLink = await prisma.friendLink.update({
    where: { id },
    data: {
      ...input,
    },
  })

  return updatedFriendLink
}
