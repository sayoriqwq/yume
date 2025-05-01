'use server'

import type { BatchLikeStatus, LikeActionParams, LikeResponse, LikeStatus, LikeTarget } from '@/types/like'
import { checkUserLiked, getLikesCount, toggleArticleLike, toggleCommentLike } from '@/db/like/service'
import { errorLogger } from '@/lib/error-handler'
import { createYumeError, YumeErrorType } from '@/lib/YumeError'
import { LikeableType } from '@/types/like'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

/**
 * 切换点赞状态
 */
export async function toggleLike({
  targetId,
  type,
  path,
  userId,
}: LikeActionParams): Promise<LikeResponse> {
  try {
    // 根据类型调用不同的点赞服务
    let result
    if (type === LikeableType.ARTICLE) {
      result = await toggleArticleLike(userId, targetId)
    }
    else if (type === LikeableType.COMMENT) {
      result = await toggleCommentLike(userId, targetId)
    }
    else {
      throw createYumeError(new Error('不支持的点赞类型'), YumeErrorType.ValidationError)
    }

    // 获取最新的点赞数
    const count = await getLikesCount(targetId, type)

    // 刷新页面数据
    revalidatePath(path)

    return {
      success: true,
      liked: result.liked,
      count,
    }
  }
  catch (error) {
    errorLogger(error)
    return {
      success: false,
      error: createYumeError(error),
    }
  }
}

/**
 * 获取点赞状态
 */
export async function getLikeStatus(targetId: number, type: LikeableType): Promise<LikeStatus> {
  try {
    const { userId } = await auth()

    if (!userId) {
      // 未登录用户返回未点赞状态和总数
      const count = await getLikesCount(targetId, type)
      return [false, count]
    }

    return Promise.all([
      checkUserLiked(userId, targetId, type),
      getLikesCount(targetId, type),
    ])
  }
  catch (error) {
    errorLogger(error)
    // 出错时返回安全默认值
    return [false, 0]
  }
}

/**
 * 获取多个目标的点赞状态
 * 用于评论列表等场景，避免多次请求
 */
export async function getBatchLikeStatus(items: LikeTarget[]): Promise<BatchLikeStatus> {
  try {
    const { userId } = await auth()
    const result: BatchLikeStatus = {}

    // 如果用户未登录，只获取点赞数量
    if (!userId) {
      await Promise.all(items.map(async (item) => {
        const count = await getLikesCount(item.id, item.type)
        result[`${item.type}-${item.id}`] = [false, count]
      }))
      return result
    }

    // 如果用户已登录，获取点赞状态和数量
    await Promise.all(items.map(async (item) => {
      const [liked, count] = await Promise.all([
        checkUserLiked(userId, item.id, item.type),
        getLikesCount(item.id, item.type),
      ])
      result[`${item.type}-${item.id}`] = [liked, count]
    }))

    return result
  }
  catch (error) {
    errorLogger(error)
    return {}
  }
}
