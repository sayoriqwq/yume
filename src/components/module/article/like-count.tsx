import { cn } from '@/lib/utils'

interface LikeCountProps {
  count: number
  className?: string
}

export function LikeCount({ count, className }: LikeCountProps) {
  return (
    <span className={cn('flex-center gap-1', className)}>
      <span aria-hidden className="i-mingcute-heart-line size-3" />
      {' '}
      {count.toString()}
    </span>
  )
}
