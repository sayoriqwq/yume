'server only'

import type { z } from 'zod'
import type { updateCommentSchema } from '../schema'
import prisma from '@/db/prisma'

export async function updateComment(input: z.infer<typeof updateCommentSchema>, id: number) {
  const { content, status, deleted } = input

  const comment = await prisma.comment.update({
    where: { id },
    data: {
      ...(content !== undefined && { content }),
      ...(status !== undefined && { status }),
      ...(deleted !== undefined && { deleted }),
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
      likesCount: comment.likes.length,
      repliesCount: comment._count.replies,
    },
  }
}
