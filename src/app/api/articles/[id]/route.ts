import type { NextRequest } from 'next/server'
import { getArticleById } from '@/db/article/service'
import { errorLogger } from '@/lib/error-handler'
import { createYumeErrorResponse } from '@/lib/YumeError'
import { NextResponse } from 'next/server'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idString } = await params
    const id = Number.parseInt(idString)
    const article = await getArticleById(id)

    return NextResponse.json(article)
  }
  catch (error) {
    errorLogger(error)
    return createYumeErrorResponse(error)
  }
}
