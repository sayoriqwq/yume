'server only'

import prisma from '@/db/prisma'

// 硬删除
export async function deleteCommentPermanently(id: number) {
  return await prisma.comment.delete({
    where: { id },
  })
}

// 软删除 - 将评论标记为已删除而不实际删除它
export async function deleteComment(id: number) {
  return await prisma.comment.update({
    where: { id },
    data: {
      deleted: true,
    },
  })
}
