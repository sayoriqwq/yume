'use client'

import type { MouseEvent } from 'react'

import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export interface BackProps extends Omit<ButtonProps, 'asChild'> {
  label?: string
  fallbackHref?: string
}

export function Back({
  className,
  label = 'back',
  fallbackHref = '/',
  variant = 'secondary',
  size = 'sm',
  onClick,
  ...rest
}: BackProps) {
  const router = useRouter()
  const pathname = usePathname()

  if (pathname === '/')
    return null

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
      return
    }

    if (fallbackHref) {
      router.push(fallbackHref)
    }
  }

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (event.defaultPrevented)
      return

    handleBack()
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn('gap-2 w-fit', className)}
      aria-label={label}
      onClick={handleClick}
      {...rest}
    >
      <span aria-hidden className="i-mingcute-arrow-left-line text-lg" />
      <span>{label}</span>
    </Button>
  )
}
