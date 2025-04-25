import type { Prisma } from '@/generated'
import type { NextRequest } from 'next/server'
import { articleListQuerySchema } from '@/db/article/schema'
import { getArticles } from '@/db/article/service'
import { errorLogger } from '@/lib/error-handler'
import { parseGetQuery } from '@/lib/parser'
import { createYumeErrorResponse } from '@/lib/YumeError'
import { NextResponse } from 'next/server'

export type ArticleFromGet = Prisma.ArticleGetPayload<{
  include: {
    category: true
    tags: true
    _count: {
      select: { comments: true }
    }
  }
}>

export interface ArticlesResponse {
  articles: ArticleFromGet[]
  meta: {
    currentPage: number
    totalPages: number
    totalCount: number
    limit: number
  }
}

export async function GET(request: NextRequest) {
  try {
    const input = parseGetQuery(request, articleListQuerySchema)

    const data = await getArticles({
      ...input,
      published: true,
    })

    return NextResponse.json(data)
  }
  catch (error) {
    errorLogger(error)
    return createYumeErrorResponse(error)
  }
}
