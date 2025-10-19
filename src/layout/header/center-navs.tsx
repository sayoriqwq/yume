'use client'

import type { HeaderTabs } from './atoms/header'
import { useAtom } from 'jotai'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { navIconSet } from '@/components/icon/nav'
import { cn } from '@/lib/utils'
import { headerSelectedAtom } from './atoms/header'

const navs = [
  {
    name: '博客',
    href: '/posts',
    iconClass: navIconSet.blog,
  },
  {
    name: '朋友',
    href: '/friend',
    iconClass: navIconSet.friend,
  },
  {
    name: '关于',
    href: '/about',
    iconClass: navIconSet.about,
  },
  {
    name: '留言',
    href: '/message',
    iconClass: navIconSet.message,
  },
]

export function CenterNavs() {
  const [selected, setSelected] = useAtom(headerSelectedAtom)
  const pathname = usePathname()

  useEffect(() => {
    const matchedNav = navs.find(nav => pathname.startsWith(nav.href))
    if (matchedNav) {
      setSelected(matchedNav.href as HeaderTabs)
    }
  }, [pathname, setSelected])

  return (
    <div className="flex">
      {navs.map(nav => (
        <Link
          href={nav.href}
          className={cn(
            'relative rounded-md px-2 py-1 flex justify-center items-center gap-2',
            'hover:text-yume-spotlight-foreground',
            'transition-all duration-300 ease-in-out',
            selected === nav.href && 'text-yume-spotlight-foreground px-4',
          )}
          key={nav.href}
        >
          <div
            className={cn(
              'w-0 scale-0 transition-all duration-300 ease-in-out opacity-0 flex justify-center items-center',
              selected === nav.href && 'w-4 scale-100 opacity-100',
            )}
          >
            <span aria-hidden="true" className={`${nav.iconClass} size-4`} />
          </div>
          <span className="relative z-10">{nav.name}</span>
        </Link>
      ))}
    </div>
  )
}
