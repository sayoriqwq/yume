'use client'

import type { ReactNode } from 'react'
import { useLenis } from 'lenis/react'
import React from 'react'
import { slugify } from '../../utils'

export function LinkToHeading({ children }: { children: ReactNode }) {
  const lenis = useLenis()
  const slug = slugify(children?.toString() || '')
  return (
    <a
      href={`#${slug}`}
      className="link-anchor"
      onClick={(e) => {
        e.preventDefault()
        const element: HTMLElement | null = document.querySelector(`#${slug}`)
        if (element) {
          window.history.pushState(null, '', `#${slug}`)
          lenis?.scrollTo(element, { offset: -60 })
        }
      }}
    >
      {children}
    </a>
  )
}
