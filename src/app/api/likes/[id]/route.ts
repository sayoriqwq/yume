import type { NextRequest } from 'next/server'
import { checkUserLiked, getLikesCount, toggleArticleLike } from '@/db/like/service'
import { createYumeError, createYumeErrorResponse, YumeErrorType } from '@/lib/YumeError'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: idString } = await params
    const articleId = Number.parseInt(idString)
    if (Number.isNaN(articleId)) {
      throw createYumeError(new Error('文章ID必须是数字'), YumeErrorType.BadRequestError)
    }

    const { userId } = await auth()

    const count = await getLikesCount(articleId, 'ARTICLE')
    const liked = userId ? await checkUserLiked(userId, articleId, 'ARTICLE') : false

    return NextResponse.json({ liked, count })
  }
  catch (error) {
    return createYumeErrorResponse(error)
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: idString } = await params
    const articleId = Number.parseInt(idString)
    if (Number.isNaN(articleId)) {
      throw createYumeError(new Error('文章ID必须是数字'), YumeErrorType.BadRequestError)
    }

    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { success: false, message: '请先登录' },
        { status: 401 },
      )
    }

    const result = await toggleArticleLike(userId, articleId)
    const count = await getLikesCount(articleId, 'ARTICLE')

    return NextResponse.json({
      success: true,
      message: result.liked ? '点赞成功' : '取消点赞成功',
      liked: result.liked,
      count,
    })
  }
  catch (error) {
    return createYumeErrorResponse(error)
  }
}
