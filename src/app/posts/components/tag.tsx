import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

export interface TagProps extends ComponentPropsWithoutRef<'span'> {
  selected?: boolean
}

export function Tag({ className, selected = false, ...props }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-sm border transition-colors duration-300',
        selected
          ? ' bg-secondary/10 text-secondary'
          : ' bg-background text-text-tertiary border-border',
        className,
      )}
      {...props}
    />
  )
}
