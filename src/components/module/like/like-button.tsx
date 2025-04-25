'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useOptimistic, useState, useTransition } from 'react'
import { toast } from 'react-hot-toast'

interface LikeState {
  liked: boolean
  count: number
}

export function LikeButton({
  targetId,
  type = 'ARTICLE',
  initialLiked = false,
  initialCount = 0,
}: {
  targetId: number
  type?: 'ARTICLE' | 'COMMENT'
  initialLiked?: boolean
  initialCount?: number
}) {
  const { user } = useUser()
  const [isPending, startTransition] = useTransition()
  const [likeState, setLikeState] = useState<LikeState>({
    liked: initialLiked,
    count: initialCount,
  })

  // 使用 useOptimistic 进行乐观更新
  const [optimistic, addOptimistic] = useOptimistic(
    likeState,
    (state): LikeState => ({
      liked: !state.liked,
      count: state.count + (state.liked ? -1 : 1),
    }),
  )

  useEffect(() => {
    // 初始状态加载，如果有初始值则不加载
    if (initialLiked === false && initialCount === 0) {
      const fetchLikeStatus = async () => {
        try {
          const response = await fetch(`/api/likes?targetId=${targetId}&type=${type}`)
          if (response.ok) {
            const data = await response.json()
            setLikeState({ liked: data.liked, count: data.count })
          }
        }
        catch (error) {
          console.error('获取点赞状态失败:', error)
        }
      }

      fetchLikeStatus()
    }
  }, [targetId, type, initialLiked, initialCount])

  const toggleLike = () => {
    if (!user) {
      toast.error('请先登录')
      return
    }

    // 乐观更新
    addOptimistic({})

    // 服务器操作
    startTransition(async () => {
      try {
        const response = await fetch('/api/likes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ targetId, type }),
        })

        if (!response.ok) {
          throw new Error('操作失败')
        }

        const result = await response.json()
        if (result.success) {
          setLikeState({ liked: result.liked, count: result.count })
        }
        else {
          throw new Error(result.message)
        }
      }
      catch (error) {
        toast.error(error instanceof Error ? error.message : '操作失败')
        // 回滚状态
        setLikeState(prev => ({
          liked: !prev.liked,
          count: prev.count + (prev.liked ? 1 : -1),
        }))
      }
    })
  }

  return (
    <button
      onClick={toggleLike}
      disabled={isPending}
      className={`flex items-center gap-1.5 text-sm transition-colors ${
        optimistic.liked ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'
      }`}
      aria-label={optimistic.liked ? '取消点赞' : '点赞'}
    >
      {optimistic.liked ? <LikeFilledIcon className="w-4 h-4" /> : <LikeIcon className="w-4 h-4" />}
      <span>{optimistic.count}</span>
    </button>
  )
}
