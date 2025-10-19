import type { PropsWithChildren } from 'react'
import type { PropsWithCC } from '@/types/extend'
import { cn } from '@/lib/utils'

const base = 'container max-w-5xl px-10 py-24 mx-auto'

export function NormalLayout({ children }: PropsWithChildren) {
  return <div className={cn(base)}>{children}</div>
}

export function WiderLayout({ children }: PropsWithChildren) {
  return <div className={cn(base, 'max-w-8xl')}>{children}</div>
}

export function NormalContainer({ children, className }: PropsWithCC) {
  return <div className={cn(base, className)}>{children}</div>
}

export function WiderContainer({ children, className }: PropsWithCC) {
  return <div className={cn(base, 'max-w-8xl', className)}>{children}</div>
}
