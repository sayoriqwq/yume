import type { NextRequest } from 'next/server'
import { getArticleById, getArticleBySlug, incrementArticleViews } from '@/db/article/service'
import { errorLogger } from '@/lib/error-handler'
import { createYumeError, createYumeErrorResponse, YumeErrorType } from '@/lib/YumeError'
import { NextResponse } from 'next/server'

// 增加文章浏览量
export async function POST(
  request: NextRequest,
  { params }: { params: { idOrSlug: string } },
) {
  try {
    const { idOrSlug } = params
    let articleId

    // 判断是ID还是slug
    if (/^\d+$/.test(idOrSlug)) {
      articleId = Number.parseInt(idOrSlug, 10)
      // 验证文章是否存在
      const article = await getArticleById(articleId)
      if (!article) {
        throw createYumeError(new Error('文章不存在'), YumeErrorType.NotFoundError)
      }
    }
    else {
      // 通过slug查询文章
      const article = await getArticleBySlug(idOrSlug)
      if (!article) {
        throw createYumeError(new Error('文章不存在'), YumeErrorType.NotFoundError)
      }
      articleId = article.id
    }

    // 增加浏览量
    await incrementArticleViews(articleId)

    return NextResponse.json({ success: true })
  }
  catch (error) {
    errorLogger(error)
    return createYumeErrorResponse(error)
  }
}
