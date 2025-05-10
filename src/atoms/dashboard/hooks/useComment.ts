import type { ApprovalStatus } from '@/generated'
import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback } from 'react'

import useSWRImmutable from 'swr/immutable'
import { fetchCommentsAtom, optimisticRemoveCommentAtom, optimisticUpdateCommentAtom } from '../actions/comments'
import { commentIdsAtom, commentMapAtom } from '../store'
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
