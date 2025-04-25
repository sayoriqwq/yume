import type { NextRequest } from 'next/server'
import { getArticleById, getArticleBySlug, incrementArticleViews } from '@/db/article/service'
import { errorLogger } from '@/lib/error-handler'
import { createYumeError, createYumeErrorResponse, YumeErrorType } from '@/lib/YumeError'
import { NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { idOrSlug: string } },
) {
  try {
    const { idOrSlug } = params
    let article

    // 判断参数是ID还是slug
    if (/^\d+$/.test(idOrSlug)) {
      // 是数字ID
      const id = Number.parseInt(idOrSlug, 10)
      article = await getArticleById(id)
    }
    else {
      // 是slug
      article = await getArticleBySlug(idOrSlug)
    }

    if (!article) {
      throw createYumeError(new Error('文章不存在'), YumeErrorType.NotFoundError)
    }

    // 增加浏览量
    await incrementArticleViews(article.id)

    return NextResponse.json(article)
  }
  catch (error) {
    errorLogger(error)
    return createYumeErrorResponse(error)
  }
}
