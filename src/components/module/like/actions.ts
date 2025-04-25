'use server'

import { checkUserLiked, getLikesCount, toggleLike } from '@/db/like/service'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export async function toggleArticleLikeAction(articleId: number) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('请先登录')
  }

  const result = await toggleLike(userId, articleId, 'ARTICLE')
  const count = await getLikesCount(articleId, 'ARTICLE')

  revalidatePath(`/posts/[category]/[slug]`)

  return {
    liked: result.liked,
    count,
    success: true,
  }
}

export async function getArticleLikeStatus(articleId: number) {
  const { userId } = await auth()
  const count = await getLikesCount(articleId, 'ARTICLE')

  if (!userId) {
    return { liked: false, count }
  }

  const liked = await checkUserLiked(userId, articleId, 'ARTICLE')
  return { liked, count }
}
