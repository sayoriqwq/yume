import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback } from 'react'

import useSWRImmutable from 'swr/immutable'

import { createTagAtom, fetchTagsAtom, optimisticRemoveTagAtom, optimisticUpdateTagAtom } from '../actions/tags'
import { tagIdsAtom, tagMapAtom } from '../store'
import { useCommonSwrConfig } from '../useSwrConfig'

export function useTagsData() {
  const tagIds = useAtomValue(tagIdsAtom)
  const tagMap = useAtomValue(tagMapAtom)
  const fetchTags = useSetAtom(fetchTagsAtom)
  const createTag = useSetAtom(createTagAtom)
  const updateTag = useSetAtom(optimisticUpdateTagAtom)
  const removeTag = useSetAtom(optimisticRemoveTagAtom)

  const hasData = tagIds.length > 0
  const swrConfig = useCommonSwrConfig(hasData)

  const cachedFetcher = useCallback(() => fetchTags(), [fetchTags])

  const { error, isLoading, mutate } = useSWRImmutable('tags', cachedFetcher, swrConfig)

  return {
    tagIds,
    tagMap,
    isLoading,
    error,
    mutate,
    createTag,
    updateTag,
    removeTag,
  }
}
