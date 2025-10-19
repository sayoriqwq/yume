import { cn } from '@/lib/utils'

interface ViewCountProps {
  count: number
  className?: string
}

export function ViewCount({ count, className }: ViewCountProps) {
  return (
    <span className={cn('flex-center gap-1', className)}>
      <span aria-hidden className="i-mingcute-eye-line size-3" />
      {' '}
      {count.toString()}
    </span>
  )
}
