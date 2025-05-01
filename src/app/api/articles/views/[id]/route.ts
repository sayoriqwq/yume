import type { NextRequest } from 'next/server'
import { safeIncrementArticleViews } from '@/db/article/service'
import { errorLogger } from '@/lib/error-handler'
import { createYumeError, createYumeErrorResponse, YumeErrorType } from '@/lib/YumeError'
import { NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idString } = await params

    const id = Number.parseInt(idString)
    if (Number.isNaN(id)) {
      throw createYumeError(new Error('id不是数字类型'), YumeErrorType.ValidationError)
    }

    const data = await safeIncrementArticleViews(id)

    return NextResponse.json(data)
  }
  catch (error) {
    errorLogger(error)
    return createYumeErrorResponse(error)
  }
}
