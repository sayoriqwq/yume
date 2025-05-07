import type { SingleDeleteData } from '@/lib/api'
import type { NextRequest } from 'next/server'
import { createSingleDeleteResponse, createSingleEntityResponse } from '@/lib/api'
import { parsePatchBody } from '@/lib/parser'
import { createYumeError, YumeError } from '@/lib/YumeError'
import { NextResponse } from 'next/server'
import { updateCommentSchema } from '../schema'
import { deleteComment } from './delete'
import { updateComment } from './patch'

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse<string | SingleDeleteData>> {
  const { id } = await params
  return await deleteComment(Number(id)).then(() => {
    return createSingleDeleteResponse(true)
  }).catch((error) => {
    const yumeError = createYumeError(error)
    return NextResponse.json(yumeError.toJSON())
  })
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const input = await parsePatchBody(request, updateCommentSchema)
  const { id } = await params
  if (input instanceof YumeError) {
    return NextResponse.json(input.toJSON())
  }

  const { comment } = await updateComment(input, Number(id))
  return createSingleEntityResponse(comment)
}
