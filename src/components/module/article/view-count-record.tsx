'use client'

import type { Article } from '@/generated'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

interface ViewCountRecordProps {
  articleId: number
}

export function ViewCountRecord({ articleId }: ViewCountRecordProps) {
  useViewCountRecord(articleId)
  return null
}

export function useViewCountRecord(articleId: number) {
  // 检查是否已经在当前会话中记录过访问量
  const [shouldRecord, setShouldRecord] = useState<boolean>(false)

  useEffect(() => {
    const sessionKey = `article-viewed-${articleId}`
    const hasViewed = sessionStorage.getItem(sessionKey)

    if (!hasViewed) {
      setShouldRecord(true)
      sessionStorage.setItem(sessionKey, 'true')
    }
  }, [articleId])

  // 只有当shouldRecord为true时才发送请求
  useSWR<Article>(
    shouldRecord ? `/api/articles/views/${articleId}` : null,
    {
      // 请求成功后不需要重新验证
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
    },
  )
}
