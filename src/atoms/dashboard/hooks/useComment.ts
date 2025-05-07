import type { ApprovalStatus } from '@/generated'
import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback } from 'react'

import useSWRImmutable from 'swr/immutable'
import { fetchCommentsAtom, optimisticRemoveCommentAtom, optimisticUpdateCommentAtom } from '../actions/comments'
import { articleIdToCommentsIdsAtom, commentIdsAtom, commentIdToRepliesIdsAtom, commentMapAtom } from '../store'
import { useCommonSwrConfig } from '../useSwrConfig'

export function useCommentsData(options?: { status?: ApprovalStatus, articleId?: number }) {
  const commentIds = useAtomValue(commentIdsAtom)
  const commentMap = useAtomValue(commentMapAtom)
  const fetchComments = useSetAtom(fetchCommentsAtom)
  const updateComment = useSetAtom(optimisticUpdateCommentAtom)
  const removeComment = useSetAtom(optimisticRemoveCommentAtom)

  const hasData = commentIds.length > 0
  const swrConfig = useCommonSwrConfig(hasData)

  const cachedFetcher = useCallback(() => fetchComments(options), [fetchComments, options])

  const { error, isLoading, mutate } = useSWRImmutable(
    `comments-${options?.status || 'all'}-${options?.articleId || 'all'}`,
    cachedFetcher,
    swrConfig,
  )

  return {
    commentIds,
    commentMap,
    isLoading,
    error,
    mutate,
    updateComment,
    removeComment,
  }
}

export function useCommentReplies(commentId: number) {
  const commentIdToRepliesIds = useAtomValue(commentIdToRepliesIdsAtom)
  const commentMap = useAtomValue(commentMapAtom)

  const replyIds = commentIdToRepliesIds[commentId] || []
  const replies = replyIds.map(id => commentMap[id]).filter(Boolean)

  return {
    replyIds,
    replies,
  }
}

export function useArticleComments(articleId: number) {
  const articleIdToCommentsIds = useAtomValue(articleIdToCommentsIdsAtom)
  const commentMap = useAtomValue(commentMapAtom)

  const commentIds = articleIdToCommentsIds[articleId] || []
  const comments = commentIds.map(id => commentMap[id]).filter(Boolean)

  return {
    commentIds,
    comments,
  }
}
