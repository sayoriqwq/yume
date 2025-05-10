import type { z } from 'zod'
import type { createFriendLinkSchema } from './schema'
import prisma from '../prisma'

export async function createFriendLink(data: z.infer<typeof createFriendLinkSchema>) {
  const friendLink = await prisma.friendLink.create({
    data: {
      nickname: data.nickname,
      siteName: data.siteName,
      link: data.link,
      description: data.description,
      avatar: data.avatar,
    },
  })

  return friendLink
}

export async function getFriendLinks() {
  const friendLinks = await prisma.friendLink.findMany({
    where: {
      status: 'APPROVED',
    },
    orderBy: {
      createdAt: 'asc',
    },
  })

  return friendLinks
}
