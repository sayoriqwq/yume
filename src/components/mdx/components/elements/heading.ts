import type { ReactNode } from 'react'
import React from 'react'
import { slugify } from '../../utils'
import { LinkToHeading } from './link-to-heading'

export function createHeading(level: number) {
  const Heading = ({ children }: { children: ReactNode }) => {
    const slug = slugify(children?.toString() || '')

    return React.createElement(`h${level}`, { id: slug }, [
      React.createElement(LinkToHeading, {
        key: `link-${slug}`,
        children,
      }),
    ])
  }

  Heading.displayName = `Heading${level}`
  return Heading
}
