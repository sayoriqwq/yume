import { cn } from '@/lib/utils'
import { HeartIcon } from 'lucide-react'

interface LikeCountProps {
  count: number
  className?: string
}

export function LikeCount({ count, className }: LikeCountProps) {
  return (
    <span className={cn('flex-center gap-1', className)}>
      <HeartIcon className="size-3" />
      {' '}
      {count.toString()}
    </span>
  )
}
