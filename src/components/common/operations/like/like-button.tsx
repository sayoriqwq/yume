'use client'

import type { LikeStatus } from '@/types/like'
import { getLikeStatus, toggleLike } from '@/components/common/operations/like/action'
import { errorLogger, errorToaster } from '@/lib/error-handler'
import { cn } from '@/lib/utils'
import { LikeableType } from '@/types/like'
import { useUser } from '@clerk/nextjs'
import { Heart } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useTransition } from 'react'
import { toast } from 'react-hot-toast'
import useSWR from 'swr'

interface LikeButtonProps {
  targetId: number
  type?: LikeableType
  className?: string
  initialLiked?: boolean
  initialCount?: number
}

export function LikeButton({
  targetId,
  type = LikeableType.ARTICLE,
  className,
  initialLiked = false,
  initialCount = 0,
}: LikeButtonProps) {
  const { user } = useUser()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  // 使用SWR获取点赞状态
  const { data, mutate } = useSWR<LikeStatus>(
    ['likes', type, targetId],
    () => getLikeStatus(targetId, type),
    {
      fallbackData: [initialLiked, initialCount],
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    },
  )

  // 解构当前点赞状态
  const [isLiked, likesCount] = data || [initialLiked, initialCount]

  const handleLike = () => {
    if (!user) {
      toast.error('请先登录后再点赞')
      return
    }

    // 准备乐观更新数据
    const optimisticData: LikeStatus = [
      !isLiked,
      likesCount + (isLiked ? -1 : 1),
    ]

    startTransition(async () => {
      // 使用SWR的乐观更新功能
      mutate(async () => {
        try {
          const res = await toggleLike({
            targetId,
            type,
            path: pathname,
            userId: user.id,
          })

          if (res.success) {
            if (res.liked) {
              toast.success('感谢你的喜欢!')
            }
            // 获取更新后的点赞状态
            return [res.liked, res.count] as LikeStatus
          }
          else {
            throw res.error
          }
        }
        catch (error) {
          errorLogger(error)
          errorToaster(error)
          // 发生错误时，返回修改前的数据以还原UI
          return data
        }
      }, {
        optimisticData, // 立即更新UI的临时数据
        rollbackOnError: true, // 出错时回滚UI
      })
    })
  }

  return (
    <button
      onClick={handleLike}
      disabled={isPending}
      className={cn(
        'flex items-center gap-1.5 hover:text-rose-500 transition-colors',
        isLiked && 'text-rose-500',
        isPending && 'opacity-80',
        className,
      )}
      aria-label={isLiked ? '取消点赞' : '点赞'}
    >
      <Heart
        className={cn(
          'size-5',
          isLiked && 'fill-rose-500',
        )}
      />
      <span className={cn(
        'text-sm font-medium',
      )}
      >
        {likesCount > 0 ? likesCount : ''}
      </span>
    </button>
  )
}
