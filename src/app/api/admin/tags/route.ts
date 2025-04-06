import type { SingleData } from '@/lib/api'
import type { Tag } from '@prisma/client'
import type { NextRequest } from 'next/server'
import { createSingleEntityResponse } from '@/lib/api'
import { parsePostBody } from '@/lib/parser'
import { YumeError } from '@/lib/YumeError'
import { NextResponse } from 'next/server'
import { getTags } from './get'
import { createTag } from './post'
import { createTagSchema } from './schema'

export interface TagsApiResponse {
  data: {
    tagIds: number[]
  }
  objects: {
    tagMap: Record<number, Tag>
    tagIdToArticleIds: Record<number, number[]>
  }
}

export async function GET(_request: NextRequest): Promise<NextResponse<TagsApiResponse | string>> {
  const { tags } = await getTags()
  const tagMap = tags.reduce((acc, tag) => {
    acc[tag.id] = tag
    return acc
  }, {} as Record<number, Tag>)

  const tagIdToArticleIds = tags.reduce((acc, tag) => {
    acc[tag.id] = tag.articles.map(article => article.id)
    return acc
  }, {} as Record<number, number[]>)

  return NextResponse.json<TagsApiResponse>({
    data: {
      tagIds: tags.map(tag => tag.id),
    },
    objects: {
      tagMap,
      tagIdToArticleIds,
    },
  })
}

export async function POST(request: NextRequest): Promise<NextResponse<SingleData<Tag> | string>> {
  const input = await parsePostBody(request, createTagSchema)

  if (input instanceof YumeError) {
    return NextResponse.json(input.toJSON())
  }

  const { tag } = await createTag(input)

  return createSingleEntityResponse<Tag>(tag)
}
