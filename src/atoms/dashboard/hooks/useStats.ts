import type { DashboardStatsResponse } from '@/app/api/admin/stats/route'
import { toast } from 'react-hot-toast'
import useSWR from 'swr'

export function useStats() {
  const { data, error, isLoading, mutate } = useSWR<DashboardStatsResponse>(
    '/api/admin/stats',
    async (url) => {
      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error('获取统计数据失败')
        }
        return await response.json()
      }
      catch (error) {
        toast.error(error instanceof Error ? error.message : '加载统计数据时出错')
        throw error
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1分钟内不重复请求
      errorRetryCount: 3,
    },
  )

  return {
    stats: data?.data,
    isLoading,
    error,
    mutate,
  }
}
