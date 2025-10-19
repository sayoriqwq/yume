import { cn } from '@/lib/utils'

export function LoadingIcon({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('i-mingcute-loading-3-line size-5 animate-spin', className)}
    />
  )
}
