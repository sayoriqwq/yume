import type { NormalizedArticle } from '@/atoms/dashboard/types'
import type { SingleDeleteData } from '@/lib/api'

import type { NextRequest } from 'next/server'
import { normalizeArticle } from '@/atoms/normalize/article'
import { createSingleDeleteResponse, createSingleEntityResponse } from '@/lib/api'
import { parsePatchBody } from '@/lib/parser'
import { createYumeError, createYumeErrorResponse, YumeError, YumeErrorType } from '@/lib/YumeError'

import { NextResponse } from 'next/server'
import { updateArticleSchema } from '../schema'
import { deleteArticle } from './delete'
import { updateArticle } from './patch'

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

  try {
    const article = await updateArticle(input, idNumber)
    const normalized = normalizeArticle(article)
    return createSingleEntityResponse<NormalizedArticle>(normalized)
  }
  catch (error) {
    return createYumeErrorResponse(error)
  }
}
