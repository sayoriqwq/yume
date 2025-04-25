import type { NextRequest } from 'next/server'
import { articleListQuerySchema } from '@/db/article/schema'
import { getArticles } from '@/db/article/service'
import { errorLogger } from '@/lib/error-handler'
import { parseGetQuery } from '@/lib/parser'
import { createYumeError, createYumeErrorResponse, YumeErrorType } from '@/lib/YumeError'
import { NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const tagName = params.id

    // 先获取标签
    const tag = await getTagByName(tagName)

    if (!tag) {
      throw createYumeError(new Error('标签不存在'), YumeErrorType.NotFoundError)
    }

    const input = parseGetQuery(request, articleListQuerySchema)

    const data = await getArticles({
      ...input,
      tag: tagName,
      published: true,
    })

    return NextResponse.json(data)
  }
  catch (error) {
    errorLogger(error)
    return createYumeErrorResponse(error)
  }
}
