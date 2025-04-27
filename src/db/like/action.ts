'use server'

import { checkUserLiked, getLikesCount, toggleArticleLike, toggleCommentLike } from '@/db/like/service'
import { LikeableType } from '@/generated'
import { errorLogger } from '@/lib/error-handler'
import { createYumeError, YumeErrorType } from '@/lib/YumeError'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

/**
 * 切换文章点赞状态
 */
export async function toggleLike(targetId: number, type: LikeableType, path: string) {
  // 获取当前用户信息
  const { userId } = await auth()

  // 未登录用户无法点赞
  if (!userId) {
    throw createYumeError(new Error('请先登录'), YumeErrorType.UnauthorizedError)
  }

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
    throw createYumeError(error)
  }
}

/**
 * 获取点赞状态
 */
export async function getLikeStatus(targetId: number, type: LikeableType) {
  // 获取当前用户信息
  try {
    const { userId } = await auth()
    if (!userId) {
      return false
    }
    return await checkUserLiked(userId, targetId, type)
  }
  catch (error) {
    errorLogger(error)
    throw createYumeError(error)
  }
}
