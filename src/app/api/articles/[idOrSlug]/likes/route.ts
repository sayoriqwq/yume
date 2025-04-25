import type { NextRequest } from 'next/server'
import { checkArticleLiked, getArticleById, getArticleBySlug, toggleArticleLike } from '@/db/article/service'
import { errorLogger } from '@/lib/error-handler'
import { createYumeError, createYumeErrorResponse, YumeErrorType } from '@/lib/YumeError'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// 辅助函数：获取文章ID
async function getArticleIdFromIdOrSlug(idOrSlug: string) {
  if (/^\d+$/.test(idOrSlug)) {
    const id = Number.parseInt(idOrSlug, 10)
    // 验证文章是否存在
    const article = await getArticleById(id)
    if (!article) {
      throw createYumeError(new Error('文章不存在'), YumeErrorType.NotFoundError)
    }
    return id
  }
  else {
    // 通过slug查询文章
    const article = await getArticleBySlug(idOrSlug)
    if (!article) {
      throw createYumeError(new Error('文章不存在'), YumeErrorType.NotFoundError)
    }
    return article.id
  }
}

// 检查点赞状态
export async function GET(
  request: NextRequest,
  { params }: { params: { idOrSlug: string } },
) {
  try {
    // 验证用户
    const { userId } = await auth()

    // 未登录用户默认未点赞
    if (!userId) {
      return NextResponse.json({ liked: false })
    }

    const { idOrSlug } = params
    const articleId = await getArticleIdFromIdOrSlug(idOrSlug)

    const liked = await checkArticleLiked(userId, articleId)

    return NextResponse.json({ liked })
  }
  catch (error) {
    errorLogger(error)
    return createYumeErrorResponse(error)
  }
}

// 切换点赞状态
export async function POST(
  request: NextRequest,
  { params }: { params: { idOrSlug: string } },
) {
  try {
    // 验证用户
    const { userId } = await auth()

    if (!userId) {
      throw createYumeError(new Error('请先登录'), YumeErrorType.UnauthorizedError)
    }

    const { idOrSlug } = params
    const articleId = await getArticleIdFromIdOrSlug(idOrSlug)

    const result = await toggleArticleLike(userId, articleId)

    return NextResponse.json(result)
  }
  catch (error) {
    errorLogger(error)
    return createYumeErrorResponse(error)
  }
}
