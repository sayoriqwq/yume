import { useAtomValue } from 'jotai'
import { tagsAtom } from '../store'

export function useTags() {
  const tags = useAtomValue(tagsAtom)
  return Object.values(tags)
}

export function useTag(id: number) {
  const tags = useAtomValue(tagsAtom)
  return tags[id]
}
