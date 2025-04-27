import type { Article } from '@/generated'
import type { SingleData } from '@/lib/api'
import type { NextRequest } from 'next/server'
import { ArticleType } from '@/generated'
import { createSingleEntityResponse } from '@/lib/api'
import { parseGetQuery, parsePostBody } from '@/lib/parser'
import { createYumeError, createYumeErrorResponse, YumeErrorType } from '@/lib/YumeError'
import { NextResponse } from 'next/server'
import { getArticles } from './get'
import { createDraft, createNote } from './post'
import { articleSchema, createArticleSchema } from './schema'

export interface ArticlesResponse {
  data: {
    articleIds: number[]
    count: number
  }
  objects: {
    articleMap: Record<number, Article>
    articleIdToCategoryId: Record<number, number>
    articleIdToTagIds: Record<number, number[]>
  }
}

export async function GET(request: NextRequest): Promise<NextResponse<ArticlesResponse | string>> {
  try {
    const input = parseGetQuery(request, articleSchema)

    const { type } = input

    const { articles, count } = await getArticles(type)

    const articleMap = articles.reduce<Record<number, Article>>((acc, article) => {
      acc[article.id] = article
      return acc
    }, {})

    const articleIdToCategoryId = articles.reduce<Record<number, number>>((acc, article) => {
      acc[article.id] = article.categoryId
      return acc
    }, {})

    const articleIdToTagIds = articles.reduce<Record<number, number[]>>((acc, article) => {
      acc[article.id] = article.tags?.map(tag => tag.id) || []
      return acc
    }, {})

    return NextResponse.json({
      data: {
        articleIds: articles.map(article => article.id),
        count,
      },
      objects: {
        articleMap,
        articleIdToCategoryId,
        articleIdToTagIds,
      },
    })
  }
  catch (error) {
    return createYumeErrorResponse(error)
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<SingleData<Article> | string>> {
  try {
    const input = await parsePostBody(request, createArticleSchema)

    const { type } = input

    if (type === ArticleType.NOTE) {
      const note = await createNote(input)
      return createSingleEntityResponse(note)
    }
    if (type === ArticleType.DRAFT) {
      const draft = await createDraft(input)
      return createSingleEntityResponse(draft)
    }
    throw createYumeError(new Error('文章类型错误'), YumeErrorType.BadRequestError)
  }
  catch (error) {
    return createYumeErrorResponse(error)
  }
}
