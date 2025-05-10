import type { FriendLinkListResponse } from '@/app/api/admin/friend-links/route'
import type { FriendLink } from '@/generated'
import { yumeFetchDelete, yumeFetchPatch } from '@/lib/yume-fetcher'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import useSWR from 'swr'

export function useFriendLink(status?: string) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  // 构建URL，支持状态过滤
  const url = status ? `/api/admin/friend-links?status=${status}` : '/api/admin/friend-links'

  const { data, isLoading, error, mutate } = useSWR<FriendLinkListResponse>(url)

  async function updateFriendLink(id: number, updates: Partial<FriendLink>) {
    try {
      setIsUpdating(true)

      // 先更新本地缓存以提供即时反馈
      const optimisticData: FriendLinkListResponse = {
        ...data!,
        data: data?.data.map(friendLink =>
          friendLink.id === id ? { ...friendLink, ...updates } : friendLink,
        ) || [],
      }

      // 使用乐观更新
      mutate(optimisticData, false)

      // 发送API请求
      await yumeFetchPatch<FriendLink>(`/admin/friend-links/${id}`, updates)

      // 刷新数据以确保与服务器同步
      await mutate()

      toast.success('友链信息已成功更新')
    }
    catch (error) {
      // 恢复原始数据
      await mutate()

      toast.error(error instanceof Error ? error.message : '无法更新友链信息')
      console.error('更新友链失败:', error)
    }
    finally {
      setIsUpdating(false)
    }
  }

  async function removeFriendLink(id: number) {
    try {
      setIsRemoving(true)

      // 先更新本地缓存以提供即时反馈
      const optimisticData: FriendLinkListResponse = {
        ...data!,
        data: data?.data.filter(friendLink => friendLink.id !== id) || [],
      }

      // 使用乐观更新
      mutate(optimisticData, false)
      // 发送API请求
      await yumeFetchDelete(`/admin/friend-links/${id}`)
      // 确认删除成功
      toast.success('友链已成功从系统中移除')
    }
    catch (error) {
      // 恢复原始数据
      await mutate()

      toast.error(error instanceof Error ? error.message : '无法删除友链')
      console.error('删除友链失败:', error)
    }
    finally {
      setIsRemoving(false)
    }
  }

  return {
    friendLinks: data?.data || [],
    meta: data?.meta,
    isLoading,
    isUpdating,
    isRemoving,
    error,
    updateFriendLink,
    removeFriendLink,
    mutate,
  }
}
