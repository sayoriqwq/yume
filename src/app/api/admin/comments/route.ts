import type { Comment } from '@/generated'
import type { SingleData } from '@/lib/api'
import type { NextRequest } from 'next/server'
import { createSingleEntityResponse } from '@/lib/api'
import { parsePostBody } from '@/lib/parser'
import { YumeError } from '@/lib/YumeError'
import { NextResponse } from 'next/server'
import { getComments } from './get'
import { createComment } from './post'
import { createCommentSchema } from './schema'

export interface CommentsApiResponse {
  data: {
    commentIds: number[]
    count: number
  }
  objects: {
    commentMap: Record<number, Comment>
    commentIdToRepliesIds: Record<number, number[]>
    articleIdToCommentsIds: Record<number, number[]>
  }
}

export async function GET(request: NextRequest): Promise<NextResponse<CommentsApiResponse | string>> {
  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get('status') as string | undefined
  const articleId = searchParams.get('articleId') ? Number.parseInt(searchParams.get('articleId')!) : undefined

  const { comments, count } = await getComments({ status, articleId })

  const commentMap = comments.reduce((acc, comment) => {
    acc[comment.id] = comment
    return acc
  }, {} as Record<number, Comment>)

  // 构建评论回复关系映射
  const commentIdToRepliesIds = comments.reduce((acc, comment) => {
    if (comment.parentId) {
      if (!acc[comment.parentId]) {
        acc[comment.parentId] = []
      }
      acc[comment.parentId].push(comment.id)
    }
    return acc
  }, {} as Record<number, number[]>)

  // 构建文章评论映射
  const articleIdToCommentsIds = comments.reduce((acc, comment) => {
    if (!comment.parentId) { // 只包含顶级评论
      if (!acc[comment.articleId]) {
        acc[comment.articleId] = []
      }
      acc[comment.articleId].push(comment.id)
    }
    return acc
  }, {} as Record<number, number[]>)

  return NextResponse.json<CommentsApiResponse>({
    data: {
      commentIds: comments.map(comment => comment.id),
      count,
    },
    objects: {
      commentMap,
      commentIdToRepliesIds,
      articleIdToCommentsIds,
    },
  })
}

export async function POST(request: NextRequest): Promise<NextResponse<SingleData<Comment> | string>> {
  const input = await parsePostBody(request, createCommentSchema)

  if (input instanceof YumeError) {
    return NextResponse.json(input.toJSON())
  }

  const { comment } = await createComment(input)

  return createSingleEntityResponse<Comment>(comment)
}
