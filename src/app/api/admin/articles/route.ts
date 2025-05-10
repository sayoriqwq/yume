import type { ArticlesResponse, NormalizedArticle } from '@/atoms/dashboard/types'
import type { NextRequest } from 'next/server'
import { normalizeArticle, normalizeArticles } from '@/atoms/normalize/article'
import { ArticleType } from '@/generated'
import { parseGetQuery, parsePostBody } from '@/lib/parser'
import { createYumeError, createYumeErrorResponse, YumeErrorType } from '@/lib/YumeError'
import { NextResponse } from 'next/server'
import { getArticles } from './get'
import { createDraft, createNote } from './post'
import { articleSchema, createArticleSchema } from './schema'

export async function GET(request: NextRequest): Promise<NextResponse<ArticlesResponse | string>> {
  try {
    const input = parseGetQuery(request, articleSchema)
    const { type } = input
    const articles = await getArticles(type)
    const normalized = normalizeArticles(articles)
    return NextResponse.json(normalized)
  }
  catch (error) {
    return createYumeErrorResponse(error)
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<NormalizedArticle | string>> {
  try {
    const input = await parsePostBody(request, createArticleSchema)
    const { type } = input

    let article
    if (type === ArticleType.NOTE) {
      article = await createNote(input)
    }
    else if (type === ArticleType.DRAFT) {
      article = await createDraft(input)
    }
    else {
      throw createYumeError(new Error('文章类型错误'), YumeErrorType.BadRequestError)
    }

    const normalized = normalizeArticle(article)
    return NextResponse.json(normalized)
  }
  catch (error) {
    return createYumeErrorResponse(error)
  }
}
