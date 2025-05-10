import type { CommentsResponse } from '@/atoms/dashboard/types'
import type { NextRequest } from 'next/server'
import { normalizeComments } from '@/atoms/normalize/comment'
import { parseGetQuery } from '@/lib/parser'
import { createYumeErrorResponse } from '@/lib/YumeError'
import { NextResponse } from 'next/server'
import { getComments } from './get'
import { commentListSchema } from './schema'

export async function GET(request: NextRequest): Promise<NextResponse<CommentsResponse | string>> {
  try {
    const input = parseGetQuery(request, commentListSchema)
    const { status } = input
    const { comments } = await getComments({ status })
    const normalized = normalizeComments(comments)
    return NextResponse.json(normalized)
  }
  catch (error) {
    return createYumeErrorResponse(error)
  }
}
