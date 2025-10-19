import Link from 'next/link'
import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { useRegisterOutline } from '../atoms/use-register'

interface OutlineItemProps {
  id: string
  title: string
  depth: number
  active: boolean
}

export function OutlineItem({ id, title, depth, active }: OutlineItemProps) {
  const ref = useRef<HTMLLIElement | null>(null)
  useRegisterOutline({ id, ref })

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el)
      return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (history.replaceState)
      history.replaceState(null, '', `#${id}`)
  }
  return (
    <li ref={ref} className="py-1">
      <div style={{ marginLeft: depth * 12 }}>
        <Link
          href={`#${id}`}
          onClick={onClick}
          className={cn(
            'text-text-tertiary hover:text-accent',
            active && 'text-text',
          )}
        >
          {title}
        </Link>
      </div>
    </li>
  )
}
