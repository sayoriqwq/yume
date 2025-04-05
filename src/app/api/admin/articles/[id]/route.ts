import type { SingleDeleteData } from '@/lib/api'
import type { NextRequest } from 'next/server'
import { createSingleDeleteResponse, createSingleEntityResponse } from '@/lib/api'
import { parsePatchBody } from '@/lib/parser'
import { createYumeError, YumeError, YumeErrorType } from '@/lib/YumeError'
import { NextResponse } from 'next/server'
import { updateArticleSchema } from '../schema'
import { deleteArticle } from './delete'
import { getArticleDetail } from './get'
import { updateArticle } from './patch'

export interface ArticleDetailResponse {
  data: {
    tagIds: number[]
  }
  objects: {
    articleIdToTagIds: Record<number, number[]>
  }
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse<ArticleDetailResponse | string>> {
  const { id } = await params
  if (Number.isNaN(Number(id))) {
    const error = createYumeError(new Error('文章ID无效'), YumeErrorType.BadRequestError)
    return NextResponse.json(error.toJSON())
  }

  const article = await getArticleDetail(Number(id))
  if (!article) {
    const error = createYumeError(new Error('文章不存在'), YumeErrorType.NotFoundError)
    return NextResponse.json(error.toJSON())
  }

  return NextResponse.json<ArticleDetailResponse>({
    data: { tagIds: article.tags.map(tag => tag.id) },
    objects: {
      articleIdToTagIds: {
        [article.id]: article.tags.map(tag => tag.id),
      },
    },
  })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse<string | SingleDeleteData>> {
  const { id } = await params
  return await deleteArticle(Number(id)).then(() => {
    return createSingleDeleteResponse(true)
  }).catch((error) => {
    const yumeError = createYumeError(error)
    return NextResponse.json(yumeError.toJSON())
  })
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const input = await parsePatchBody(request, updateArticleSchema)
  const { id } = await params

  if (input instanceof YumeError) {
    return NextResponse.json(input.toJSON())
  }
  const idNumber = Number(id)
  if (Number.isNaN(idNumber)) {
    const error = createYumeError(new Error('文章ID无效'), YumeErrorType.BadRequestError)
    return NextResponse.json(error.toJSON())
  }

  const article = await updateArticle(input, idNumber)

  return createSingleEntityResponse({ ...article, id: idNumber })
}
