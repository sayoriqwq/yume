import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export function LoadingIcon({ className }: { className?: string }) {
  return (
    <Loader2 className={cn('size-5 animate-spin', className)} />
  )
}
