'server only'

import { LikeableType } from '@/types'
import prisma from '../prisma'

/**
 * 切换点赞状态通用函数
 */
async function toggleLike(userId: string, targetId: number, type: LikeableType) {
  // 构建查询条件
  const whereCondition = type === LikeableType.ARTICLE
    ? { userId, articleId: targetId }
    : { userId, commentId: targetId }

  // 查找现有点赞
  const existingLike = await prisma.like.findFirst({
    where: whereCondition,
  })

  if (existingLike) {
    // 取消点赞
    await prisma.like.delete({
      where: { id: existingLike.id },
    })
    return { liked: false }
  }

  // 添加点赞数据
  const createData = type === LikeableType.ARTICLE
    ? { userId, articleId: targetId }
    : { userId, commentId: targetId }

  // 添加点赞
  await prisma.like.create({
    data: createData,
  })
  return { liked: true }
}

/**
 * 切换文章点赞状态
 */
export async function toggleArticleLike(userId: string, articleId: number) {
  // 检查文章是否存在
  const article = await prisma.article.findUnique({
    where: { id: articleId },
  })

  if (!article) {
    throw new Error('文章不存在或已被删除')
  }

  return toggleLike(userId, articleId, LikeableType.ARTICLE)
}

/**
 * 切换评论点赞状态
 */
export async function toggleCommentLike(userId: string, commentId: number) {
  // 检查评论是否存在
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  })

  if (!comment) {
    throw new Error('评论不存在或已被删除')
  }

  return toggleLike(userId, commentId, LikeableType.COMMENT)
}

/**
 * 检查用户是否已点赞
 */
export async function checkUserLiked(userId: string, id: number, type: LikeableType) {
  const where = type === LikeableType.ARTICLE
    ? { userId, articleId: id }
    : { userId, commentId: id }

  const like = await prisma.like.findFirst({ where })

  return !!like
}

/**
 * 获取内容点赞数
 */
export async function getLikesCount(id: number, type: LikeableType) {
  const where = type === LikeableType.ARTICLE
    ? { articleId: id }
    : { commentId: id }

  return await prisma.like.count({ where })
}

/**
 * 获取点赞列表
 */
export async function getLikes(id: number, type: LikeableType) {
  const where = type === LikeableType.ARTICLE
    ? { articleId: id, type }
    : { commentId: id, type }

  return await prisma.like.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          image_url: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

/**
 * 批量获取点赞状态 (优化性能)
 */
export async function getBatchLikeStatus(
  userId: string | null,
  items: Array<{ id: number, type: LikeableType }>,
) {
  const result: Record<string, [boolean, number]> = {}

  // 对每个项目并行获取点赞信息
  await Promise.all(
    items.map(async (item) => {
      const { id, type } = item
      const key = `${type}_${id}`

      // 获取点赞数
      const count = await getLikesCount(id, type)

      // 如果未登录，直接返回未点赞状态
      if (!userId) {
        result[key] = [false, count]
        return
      }

      // 获取点赞状态
      const liked = await checkUserLiked(userId, id, type)
      result[key] = [liked, count]
    }),
  )

  return result
}
