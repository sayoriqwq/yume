'use client'

import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { headingRefsAtom, sectionsAtom, setVisibleIdsAtom } from '@/atoms/toc/toc'

export function useVisibleSections() {
  const sections = useAtomValue(sectionsAtom)
  const setVisibleIds = useSetAtom(setVisibleIdsAtom)
  const headingRefs = useAtomValue(headingRefsAtom)
  const ticking = useRef<number | null>(null)

  const check = useCallback(() => {
    const { innerHeight, scrollY } = window
    const visible: string[] = []
    for (let i = 0; i < sections.length; i++) {
      const { id } = sections[i]
      const next = sections[i + 1]
      const el = headingRefs.get(id)?.current
      if (!el)
        continue
      const top = el.getBoundingClientRect().top + scrollY
      const nextTop = next ? headingRefs.get(next.id)?.current?.getBoundingClientRect().top : undefined
      const bottom = (nextTop ?? Infinity) + scrollY
      const inViewport
        = (top > scrollY && top < scrollY + innerHeight)
          || (bottom > scrollY && bottom < scrollY + innerHeight)
          || (top <= scrollY && bottom >= scrollY + innerHeight)
      if (inViewport)
        visible.push(id)
    }
    setVisibleIds(visible)
  }, [sections, headingRefs, setVisibleIds])

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current)
        cancelAnimationFrame(ticking.current)
      ticking.current = requestAnimationFrame(check)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (ticking.current)
        cancelAnimationFrame(ticking.current)
    }
  }, [check])

  useLayoutEffect(() => {
    check()
  }, [check])
}
