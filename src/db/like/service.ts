import { LikeableType } from '@prisma/client'
import prisma from '../prisma'

/**
 * 切换点赞状态（点赞/取消点赞）
 */
export async function toggleLike(userId: string, targetId: number, type: LikeableType) {
  // 检查点赞是否已存在
  const existingLike = await prisma.like.findFirst({
    where: {
      userId,
      targetId,
      type,
    },
  })

  // 如果已点赞，则取消
  if (existingLike) {
    await prisma.like.delete({
      where: { id: existingLike.id },
    })
    return { liked: false }
  }

  // 否则创建新的点赞
  await prisma.like.create({
    data: {
      userId,
      targetId,
      type,
    },
  })
  return { liked: true }
}

export async function toggleArticleLike(userId: string, articleId: number) {
  return toggleLike(userId, articleId, LikeableType.ARTICLE)
}

export async function toggleCommentLike(userId: string, commentId: number) {
  return toggleLike(userId, commentId, LikeableType.COMMENT)
}

/**
 * 检查用户是否已点赞
 */
export async function checkUserLiked(userId: string, targetId: number, type: LikeableType) {
  const like = await prisma.like.findFirst({
    where: {
      userId,
      targetId,
      type,
    },
  })

  return !!like
}

/**
 * 获取内容点赞数
 */
export async function getLikesCount(targetId: number, type: LikeableType) {
  const count = await prisma.like.count({
    where: {
      targetId,
      type,
    },
  })

  return count
}
