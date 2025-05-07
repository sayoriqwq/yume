'use client'

import { headerSelectedAtom } from '@/atoms/header'
import { cn } from '@/lib/utils'
import { useAtom } from 'jotai'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function Logo({ text, className }: { text?: string, className?: string }) {
  const [_selected, setSelected] = useAtom(headerSelectedAtom)
  const router = useRouter()
  return (
    <Link
      href="/"
      className={cn('font-aboreto text-xl font-bold transition-colors hover:text-yume-spotlight-foreground duration-300 ease-in-out', className)}
      onClick={() => setSelected('/')}
      onDoubleClick={() => router.push('/dashboard')}
    >
      {text || 'yume'}
    </Link>
  )
}
