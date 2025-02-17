'use client'

import type { Post } from '@/types/post'
import { ScrollToShow } from '@/components/common/framer-animation/scroll-to-show'
import { NormalTime } from '@/components/common/time'
import Link from 'next/link'

interface DraftItemProps {
  post: Post
}

export function DraftItem({ post }: DraftItemProps) {
  return (
    <ScrollToShow y={20}>
      <Link href={`/posts/${post.metadata.category}/${post.slug}`} className="flex flex-col p-3 group">
        <article className="flex-between">
          <h2 className="font-heading relative line-clamp-1 w-fit max-w-64 text-xl group-hover:max-w-full transition-all duration-300">
            {post.metadata.title}
          </h2>
          <NormalTime date={post.metadata.publishedAt} className="text-muted-foreground" />
        </article>
      </Link>
    </ScrollToShow>
  )
}
