'use client'

import type { Post, Tag } from '#site/content'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { getPostsByTagSlugs, getTagMap } from '@/data/tag'
import { BlogPostCard } from './post-card'
import { Tag as TagBadge } from './tag'

interface FilterablePostGridProps {
  posts: Post[]
  tags: Tag[]
}

export function FilterablePostGrid({ posts, tags }: FilterablePostGridProps) {
  const tagMap = getTagMap()

  const allTagSlugs = useMemo(() => {
    const ordered: string[] = tags.map(tag => tag.slug)
    const seen = new Set(ordered)

    for (const post of posts) {
      if (!post.tags?.length)
        continue

      for (const slug of post.tags) {
        if (!seen.has(slug)) {
          seen.add(slug)
          ordered.push(slug)
        }
      }
    }

    return ordered
  }, [posts, tags])

  const [activeTagSlugs, setActiveTagSlugs] = useState(() => [...allTagSlugs])

  useEffect(() => {
    setActiveTagSlugs((prev) => {
      if (prev.length === allTagSlugs.length && prev.every((slug, index) => slug === allTagSlugs[index]))
        return prev

      return [...allTagSlugs]
    })
  }, [allTagSlugs])

  const filteredPosts = useMemo(() => {
    if (!allTagSlugs.length)
      return posts
    if (activeTagSlugs.length === allTagSlugs.length)
      return posts
    if (activeTagSlugs.length === 0)
      return []

    return getPostsByTagSlugs(activeTagSlugs)
  }, [activeTagSlugs, allTagSlugs, posts])

  const handleToggleTag = (slug: string) => {
    setActiveTagSlugs((prev) => {
      if (prev.includes(slug))
        return prev.filter(item => item !== slug)

      const next = new Set([...prev, slug])
      return allTagSlugs.filter(item => next.has(item))
    })
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-semibold uppercase tracking-wide text-text-secondary">Filter by tag</h2>
        <div className="flex flex-wrap gap-2">
          {
            allTagSlugs?.map((slug) => {
              const tag = tagMap[slug]
              const label = tag?.title ?? slug
              const isActive = activeTagSlugs.includes(slug)

              return (
                <span
                  key={slug}
                  onClick={() => handleToggleTag(slug)}
                  className="cursor-pointer select-none"
                >
                  <TagBadge selected={isActive} className="gap-1">
                    {label}
                  </TagBadge>
                </span>
              )
            })
          }
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {filteredPosts.map((post) => {
          return (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <BlogPostCard post={post} />
            </Link>
          )
        })}
      </div>

    </section>
  )
}
