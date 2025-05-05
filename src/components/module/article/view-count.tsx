import { cn } from '@/lib/utils'
import { EyeIcon } from 'lucide-react'

interface ViewCountProps {
  count: number
  className?: string
}

export function ViewCount({ count, className }: ViewCountProps) {
  return (
    <span className={cn('flex-center gap-1', className)}>
      <EyeIcon className="size-3" />
      {' '}
      {count.toString()}
    </span>
  )
}
