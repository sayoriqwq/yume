import { getComments } from '@/components/module/comment/actions'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ articleId: string }> },
) {
  const { articleId: articleIdStr } = await params
  const articleId = Number.parseInt(articleIdStr)
  if (Number.isNaN(articleId)) {
    return NextResponse.json({ error: '无效的文章ID' }, { status: 400 })
  }

  const comments = await getComments(articleId)

  const commentsWithReplies = comments.map(comment => ({
    ...comment,
    replies: comment.replies || [],
  }))

  return NextResponse.json(commentsWithReplies)
}
