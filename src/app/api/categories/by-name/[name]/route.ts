import type { NextRequest } from 'next/server'
import { articleListQuerySchema } from '@/db/article/schema'
import { getArticlesByCategoryName } from '@/db/category/service'
import { errorLogger } from '@/lib/error-handler'
import { parseGetQuery } from '@/lib/parser'
import { createYumeErrorResponse } from '@/lib/YumeError'
import { NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } },
) {
  try {
    const { name } = params

    // 解析查询参数
    const input = parseGetQuery(request, articleListQuerySchema)

    // 获取该分类下的文章
    const data = await getArticlesByCategoryName(name, {
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
