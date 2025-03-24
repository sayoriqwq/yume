import type { Tag } from '../store'
import useSWR from 'swr'
import { useNormalizeResponse } from '../normalize'

interface TagsResponse {
  data: {
    tagIds: number[]
  }
  objects: {
    tags: Record<number, Tag>
  }
}

export function useTags() {
  const normalizeResponse = useNormalizeResponse()

  return useSWR<TagsResponse>('/api/tags', async (url: string) => {
    const res = await fetch(url)
    const data = await res.json()

    // 规范化并存储数据
    normalizeResponse(data)
    return data
  })
}
