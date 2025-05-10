'use server'

import prisma from '@/db/prisma'
import { createYumeError, YumeErrorType } from '@/lib/YumeError'

export async function deleteFriendLink(id: number) {
  // 检查友链是否存在
  const existingFriendLink = await prisma.friendLink.findUnique({
    where: { id },
  })

  if (!existingFriendLink) {
    throw createYumeError(`ID为${id}的友链不存在`, YumeErrorType.NotFoundError)
  }

  // 删除友链
  return await prisma.friendLink.delete({
    where: { id },
  })
}
