import type { NormalizedTag, TagsResponse } from '@/atoms/dashboard/types'
import type { Tag } from '@/generated'
import type { SingleData } from '@/lib/api'
import type { NextRequest } from 'next/server'
import { normalizeTag, normalizeTags } from '@/atoms/normalize/tag'
import { createSingleEntityResponse } from '@/lib/api'
import { parsePostBody } from '@/lib/parser'
import { createYumeErrorResponse, YumeError } from '@/lib/YumeError'
import { NextResponse } from 'next/server'
import { getTags } from './get'
import { createTag } from './post'
import { createTagSchema } from './schema'

export async function GET(_request: NextRequest): Promise<NextResponse<TagsResponse | string>> {
  try {
    const tags = await getTags()
    const normalized = normalizeTags(tags)
    return NextResponse.json(normalized)
  }
  catch (error) {
    return createYumeErrorResponse(error)
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<SingleData<Tag> | string>> {
  const input = await parsePostBody(request, createTagSchema)
  if (input instanceof YumeError) {
    return NextResponse.json(input.toJSON())
  }

  try {
    const tag = await createTag(input)
    const normalized = normalizeTag(tag)
    return createSingleEntityResponse<NormalizedTag>(normalized)
  }
  catch (error) {
    return createYumeErrorResponse(error)
  }
}
