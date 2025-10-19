import Link from 'next/link'
import { cn } from '@/lib/utils'

export function ReadMore({ href, className }: { href: string, className?: string }) {
  return (
    <Link
      href={href}
      className={cn('group inline-flex items-center gap-2 text-sm', className)}
    >
      <span>Read more</span>
      <span aria-hidden className="i-mingcute-arrow-right-line size-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  )
}
