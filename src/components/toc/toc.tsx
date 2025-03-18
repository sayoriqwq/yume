'use client'

import { cn } from '@/lib/utils'
import { useLenis } from 'lenis/react'
import { useEffect, useState } from 'react'

interface TocItem {
  id: string
  text: string
  level: number
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  const lenis = useLenis()

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('.prose h2, .prose h3, .prose h4'))
    const items: TocItem[] = elements.map(element => ({
      id: element.id,
      text: element.textContent || '',
      level: Number(element.tagName.charAt(1)),
    }))
    setHeadings(items)

    // 监听滚动事件来更新活动标题
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-80px 0px -80% 0px' },
    )

    elements.forEach(element => observer.observe(element))

    return () => observer.disconnect()
  }, [])

  if (headings.length === 0)
    return null

  return (
    <nav className="sticky top-1/5 ml-10 max-h-72 w-64">
      <h2 className="mb-4 text-lg font-bold">目录</h2>
      <ul className="space-y-2">
        {headings.map(heading => (
          <li
            key={heading.id}
            style={{
              marginLeft: `${(heading.level - 2) * 16}px`,
            }}
          >
            <a
              href={`#${heading.id}`}
              className={cn(
                'transition-colors hover:text-accent',
                activeId === heading.id && 'text-accent',
                activeId !== heading.id && 'text-foreground',
              )}
              onClick={(e) => {
                e.preventDefault()
                const element: HTMLElement | null = document.querySelector(
                  `#${heading.id}`,
                )
                if (element) {
                  window.history.pushState(null, '', `#${heading.id}`)
                  lenis?.scrollTo(element, { offset: -60 })
                }
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
