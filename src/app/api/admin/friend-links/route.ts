import type { FriendLink } from '@/generated'
import type { NextRequest } from 'next/server'
import { parseGetQuery } from '@/lib/parser'
import { createYumeErrorResponse } from '@/lib/YumeError'
import { NextResponse } from 'next/server'
import { getFriendLinks } from './get'
import { friendLinkListSchema } from './schema'

export interface FriendLinkListResponse {
  data: FriendLink[]
  meta: {
    total: number
  }
}

export async function GET(request: NextRequest) {
  try {
    const input = parseGetQuery(request, friendLinkListSchema)
    const { status } = input
    const { friendLinks, count } = await getFriendLinks({ status })

    return NextResponse.json<FriendLinkListResponse>({
      data: friendLinks,
      meta: {
        total: count,
      },
    })
  }
  catch (error) {
    return createYumeErrorResponse(error)
  }
}
