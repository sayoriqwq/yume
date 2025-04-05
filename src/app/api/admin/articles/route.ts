import type { SingleData } from '@/lib/api'
import type { Article } from '@prisma/client'
import type { NextRequest } from 'next/server'
import { createSingleEntityResponse } from '@/lib/api'
import { parseGetQuery, parsePostBody } from '@/lib/parser'
import { createYumeError, YumeError, YumeErrorType } from '@/lib/YumeError'
import { ArticleType } from '@prisma/client'
import { NextResponse } from 'next/server'
import { getArticles } from './get'
import { createDraft, createNote } from './post'
import { articlePaginationSchema, createArticleSchema } from './schema'

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
  const input = parseGetQuery(request, articlePaginationSchema)
  if (input instanceof YumeError) {
    return NextResponse.json(input.toJSON())
  }
  const { page, pageSize, type } = input

  const { articles, count } = await getArticles({ page, pageSize, type })

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

export async function POST(request: NextRequest): Promise<NextResponse<SingleData<Article> | string>> {
  const input = await parsePostBody(request, createArticleSchema)
  if (input instanceof YumeError) {
    return NextResponse.json(input.toJSON())
  }

  const { type } = input

  if (type === ArticleType.NOTE) {
    const note = await createNote(input)
    return createSingleEntityResponse(note)
  }
  if (type === ArticleType.DRAFT) {
    const draft = await createDraft(input)
    return createSingleEntityResponse(draft)
  }

  const error = createYumeError(new Error('无效的文章类型'), YumeErrorType.BadRequestError)

  return NextResponse.json(error.toJSON())
}
