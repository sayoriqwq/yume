'use client'

import type { Post } from '@/types/post'
import { HoverBg } from '@/components/common/framer-animation/hover-bg'
import { ScrollToShow } from '@/components/common/framer-animation/scroll-to-show'
import { PostCard } from './post-card'

export function PostsGrid({ posts }: { posts: Post[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      {posts.map(post => (
        <HoverBg key={post.metadata.slug}>
          <ScrollToShow y={40}>
            <PostCard post={post} />
          </ScrollToShow>
        </HoverBg>
      ))}
    </div>
  )
}
