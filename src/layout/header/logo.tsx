'use client'

import { headerSelectedAtom } from '@/atoms/header'
import { useAtom } from 'jotai'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function Logo() {
  const [_selected, setSelected] = useAtom(headerSelectedAtom)
  const router = useRouter()
  return (
    <Link
      href="/"
      className="font-aboreto text-xl font-bold transition-colors hover:text-yume-spotlight-foreground duration-300 ease-in-out"
      onClick={() => setSelected('/')}
      onDoubleClick={() => router.push('/dashboard')}
    >
      yume
    </Link>
  )
}
