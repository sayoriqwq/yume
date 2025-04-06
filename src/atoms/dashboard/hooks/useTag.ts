import { useAtomValue, useSetAtom } from 'jotai'
import useSWRImmutable from 'swr/immutable'

import { createTagAtom, fetchTagsAtom, optimisticRemoveTagAtom, optimisticUpdateTagAtom } from '../actions/tags'

import { articleMapAtom, tagIdsAtom, tagIdToArticleIdsAtom, tagMapAtom } from '../store'

export function useTagsData() {
  const tagIds = useAtomValue(tagIdsAtom)
  const tagMap = useAtomValue(tagMapAtom)
  const fetchTags = useSetAtom(fetchTagsAtom)
  const createTag = useSetAtom(createTagAtom)
  const updateTag = useSetAtom(optimisticUpdateTagAtom)
  const removeTag = useSetAtom(optimisticRemoveTagAtom)

  const { data, error, isLoading, mutate } = useSWRImmutable('tags', fetchTags)

  return {
    tagIds,
    tagMap,
    tags: data,
    isLoading,
    error,
    mutate,
    createTag,
    updateTag,
    removeTag,
  }
}

export function useTagDetail(id: number) {
  const tagMap = useAtomValue(tagMapAtom)
  const tagIdToArticleIds = useAtomValue(tagIdToArticleIdsAtom)
  const articleMap = useAtomValue(articleMapAtom)

  return { tag: tagMap[id], articleIds: tagIdToArticleIds[id], articleMap }
}
