'use client'

import type { RefObject } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { headingRefsAtom, registerHeadingAtom, registerOutlineItemAtom, sectionsAtom } from './toc'

// 自动扫描并注册所有 headings
export function useRegisterHeading() {
  const [sections] = useAtom(sectionsAtom)
  const [headingRefs] = useAtom(headingRefsAtom)
  const registerHeading = useSetAtom(registerHeadingAtom)

  useEffect(() => {
    if (!sections.length)
      return
    for (const section of sections) {
      const prev = headingRefs.get(section.id)
      if (!prev?.current) {
        const el = document.getElementById(section.id) as HTMLHeadingElement | null
        if (el)
          registerHeading({ id: section.id, ref: { current: el } })
      }
    }
  }, [sections, headingRefs, registerHeading])
}

interface RegisterOutlineProps {
  id: string
  ref: RefObject<HTMLLIElement | null>
}

export function useRegisterOutline({ id, ref }: RegisterOutlineProps) {
  const registerOutlineItem = useSetAtom(registerOutlineItemAtom)

  useEffect(() => {
    registerOutlineItem({ id, ref })
  }, [id, ref, registerOutlineItem])
}
