'use client'

import type { CommentWithAuthor } from '@/types/comment'
import type { LikeStatus } from '@/types/like'
import { getLikeStatus } from '@/components/common/operations/like/action'
import { LikeButton } from '@/components/common/operations/like/like-button'
import { ShareButton } from '@/components/common/operations/share/share-button'
import { getCommentStatus } from '@/components/module/comment/actions'
import { Comments } from '@/components/module/comment/comments'
import { LikeableType } from '@/types'
import { useEffect, useState } from 'react'

interface ArticleInteractionsProps {
  articleId: number
  title: string
}

export function ArticleInteractions({ articleId, title }: ArticleInteractionsProps) {
  // 使用正确的类型定义状态
  const [commentData, setCommentData] = useState<[CommentWithAuthor[], number]>([[], 0])
  const [likesData, setLikesData] = useState<LikeStatus>([false, 0])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const [commentResult, likesResult] = await Promise.all([
        getCommentStatus(articleId),
        getLikeStatus(articleId, LikeableType.ARTICLE),
      ])
      setCommentData(commentResult)
      setLikesData(likesResult)
      setLoading(false)
    }

    loadData()
  }, [articleId])

  if (loading)
    return <div>加载中...</div>

  const [initialComments, commentsCount] = commentData
  const [initialLiked, initialLikeCount] = likesData

  return (
    <div className="flex flex-col gap-4">
      <div className="mt-10 flex items-center justify-end gap-2">
        <LikeButton
          targetId={articleId}
          type={LikeableType.ARTICLE}
          initialLiked={initialLiked}
          initialCount={initialLikeCount}
        />
        <ShareButton title={title} />
      </div>

      <Comments
        articleId={articleId}
        initialComments={initialComments}
        initialCount={commentsCount}
      />
    </div>
  )
}
