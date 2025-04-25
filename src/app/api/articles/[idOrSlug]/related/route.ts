import type { NextRequest } from 'next/server'
import { getArticleById, getArticleBySlug, getRelatedArticles } from '@/db/article/service'
import { errorLogger } from '@/lib/error-handler'
import { parseGetQuery } from '@/lib/parser'
import { createYumeError, createYumeErrorResponse, YumeErrorType } from '@/lib/YumeError'
import { NextResponse } from 'next/server'
import { z } from 'zod'

// 验证查询参数
const relatedQuerySchema = z.object({
  limit: z.coerce.number().optional().default(4),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { idOrSlug: string } },
) {
  try {
    const { idOrSlug } = params
    let articleId
    let categoryId

    // 判断是ID还是slug
    if (/^\d+$/.test(idOrSlug)) {
      articleId = Number.parseInt(idOrSlug, 10)
      // 需要获取文章的分类ID
      const article = await getArticleById(articleId)
      if (!article) {
        throw createYumeError(new Error('文章不存在'), YumeErrorType.NotFoundError)
      }
      categoryId = article.categoryId
    }
    else {
      // 通过slug查询文章
      const article = await getArticleBySlug(idOrSlug)
      if (!article) {
        throw createYumeError(new Error('文章不存在'), YumeErrorType.NotFoundError)
      }
      articleId = article.id
      categoryId = article.categoryId
    }

    // 获取查询参数
    const { limit } = parseGetQuery(request, relatedQuerySchema)

    const relatedArticles = await getRelatedArticles(articleId, categoryId, limit)

    return NextResponse.json(relatedArticles)
  }
  catch (error) {
    errorLogger(error)
    return createYumeErrorResponse(error)
  }
}
