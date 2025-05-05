'use client'

import { cn } from '@/lib/utils'
import { useLenis } from 'lenis/react'
import { useCallback, useEffect, useRef, useState } from 'react'

interface TocItem {
  id: string
  text: string
  level: number
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)
  const contentLoadedRef = useRef(false)

  const lenis = useLenis()

  // 获取标题的函数 - 可以独立调用
  const getHeadings = useCallback(() => {
    const elements = Array.from(document.querySelectorAll('.prose h2, .prose h3, .prose h4'))
    return elements.map(element => ({
      id: element.id,
      text: element.textContent || '',
      level: Number(element.tagName.charAt(1)),
    }))
  }, [])

  // 设置交集观察器的函数
  const setupIntersectionObserver = useCallback(() => {
    // 如果已设置观察器，先清除
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    // 创建新的观察器
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // 筛选出可见的条目
        const visibleEntries = entries.filter(entry => entry.isIntersecting)
        if (visibleEntries.length > 0) {
          // 使用最上面的可见标题
          setActiveId(visibleEntries[0].target.id)
        }
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: [0.1, 0.5, 1], // 多阈值可提高精度
      },
    )

    // 观察所有标题元素
    document.querySelectorAll('.prose h2, .prose h3, .prose h4').forEach(
      element => observerRef.current?.observe(element),
    )
  }, [])

  // 内容加载和变化的监听
  useEffect(() => {
    // 初始尝试获取标题
    const initialHeadings = getHeadings()
    if (initialHeadings.length > 0) {
      setHeadings(initialHeadings)
      contentLoadedRef.current = true
      setupIntersectionObserver()
      return
    }

    // 如果没有找到标题，设置 MutationObserver
    const mutationObserver = new MutationObserver(() => {
      const currentHeadings = getHeadings()
      if (currentHeadings.length > 0 && !contentLoadedRef.current) {
        setHeadings(currentHeadings)
        contentLoadedRef.current = true
        setupIntersectionObserver()
      }
    })

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['id', 'class'],
    })

    // 从后台切回时重新检查，修复某些情况下的问题
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !contentLoadedRef.current) {
        const currentHeadings = getHeadings()
        if (currentHeadings.length > 0) {
          setHeadings(currentHeadings)
          contentLoadedRef.current = true
          setupIntersectionObserver()
        }
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // 清理函数
    return () => {
      mutationObserver.disconnect()
      observerRef.current?.disconnect()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [getHeadings, setupIntersectionObserver])

  // 为了防止内容变化而标题没更新，添加额外检查
  useEffect(() => {
    if (contentLoadedRef.current && headings.length > 0) {
      // 定期检查标题是否需要更新
      const interval = setInterval(() => {
        const currentHeadings = getHeadings()
        // 只有当标题数量或内容变化时才更新
        if (
          currentHeadings.length !== headings.length
          || JSON.stringify(currentHeadings) !== JSON.stringify(headings)
        ) {
          setHeadings(currentHeadings)
          setupIntersectionObserver()
        }
      }, 2000) // 每 2 秒检查一次

      return () => clearInterval(interval)
    }
  }, [getHeadings, headings, setupIntersectionObserver])

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
                  setActiveId(heading.id) // 立即更新激活的标题
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
