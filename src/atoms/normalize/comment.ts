import type { CommentsResponse, NormalizedComment } from '@/atoms/dashboard/types'
import type { Article, Comment, User } from '@/generated'

type CommentInput = Comment & {
  author: Pick<User, 'id' | 'username' | 'image_url'>
  article?: Article
  parent?: Comment
  replies?: { id: number }[]
  _count?: { likes?: number }
}

export function normalizeComment(comment: CommentInput): NormalizedComment {
  const replyIds: number[] = []
  if (comment.replies && comment.replies.length > 0) {
    comment.replies.forEach(reply => replyIds.push(reply.id))
  }

  return {
    id: comment.id,
    content: comment.content,
    authorId: comment.authorId,
    author: comment.author,
    articleId: comment.articleId,
    parentId: comment.parentId,
    status: comment.status,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    deleted: comment.deleted,
    // 特殊处理的关联数据
    replyIds,
    likeCount: comment._count?.likes || 0,
  }
}

export function normalizeComments(comments: CommentInput[]): CommentsResponse {
  const articles: Record<number, Article> = {}

  const processedData = comments.map((comment) => {
    if (comment.article) {
      articles[comment.article.id] = comment.article
    }
    return normalizeComment(comment)
  })

  return {
    data: processedData,
    objects: {
      articles,
    },
  }
}
