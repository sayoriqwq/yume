'use client'

import { toggleLike } from '@/db/like/action'
import { errorLogger, errorToaster } from '@/lib/error-handler'
import { cn } from '@/lib/utils'
import { createYumeError, YumeErrorType } from '@/lib/YumeError'
import { useUser } from '@clerk/nextjs'
import { LikeableType } from '@prisma/client'
import { Heart } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useOptimistic, useState, useTransition } from 'react'
import { toast } from 'react-hot-toast'

interface LikeButtonProps {
  targetId: number
  type?: LikeableType
  initialLiked?: boolean
  initialCount?: number
  className?: string
}

interface LikeState {
  liked: boolean
  count: number
}

export function LikeButton({
  targetId,
  type = LikeableType.ARTICLE,
  initialLiked = false,
  initialCount = 0,
  className,
}: LikeButtonProps) {
  const { user } = useUser()
  const pathname = usePathname()

  const [likeState, setLikeState] = useState<LikeState>({
    liked: initialLiked,
    count: initialCount,
  })

  const [optimisticLike, setOptimisticLike] = useOptimistic(
    likeState,
  )
  const [isPending, startTransition] = useTransition()

  const handleLike = () => {
    if (!user) {
      throw createYumeError(new Error('请先登录'), YumeErrorType.UnauthorizedError)
    }
    startTransition(async () => {
      setOptimisticLike({ liked: !optimisticLike.liked, count: optimisticLike.count + (optimisticLike.liked ? -1 : 1) })
      try {
        const res = await toggleLike(targetId, type, pathname)
        if (res.success) {
          if (res.liked) {
            toast.success('感谢你的喜欢!')
          }
          setLikeState({
            liked: res.liked,
            count: res.count,
          })
        }
        else {
          throw createYumeError(new Error('点赞失败'), YumeErrorType.ValidationError)
        }
      }
      catch (error) {
        setOptimisticLike({ liked: optimisticLike.liked, count: optimisticLike.count })
        errorToaster(error)
        errorLogger(error)
      }
    })
  }
  return (
    <button
      onClick={handleLike}
      disabled={isPending}
      className={cn(
        'flex items-center gap-1.5 hover:text-rose-500 transition-colors',
        optimisticLike.liked && 'text-rose-500',
        isPending && 'opacity-80',
        className,
      )}
      aria-label={optimisticLike.liked ? '取消点赞' : '点赞'}
    >
      <Heart
        className={cn(
          optimisticLike.liked && 'fill-rose-500',
        )}
      />
      <span className={cn(
        'text-sm font-medium',
      )}
      >
        {optimisticLike.count > 0 ? optimisticLike.count : ''}
      </span>
    </button>
  )
}
