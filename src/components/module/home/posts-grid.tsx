'use client'

import type { Post } from '@/types/article/post'
import { HoverBg } from '@/components/common/framer-animation/hover-bg'
import { ScrollToShow } from '@/components/common/framer-animation/scroll-to-show'
import { Skeleton } from '@/components/ui/skeleton'
import { Suspense, use } from 'react'
import { PostCard } from './post-card'

function PostsContent({ postsPromise }: { postsPromise: Promise<Post[]> }) {
  const posts = use(postsPromise).sort((a, b) => {
    const dateA = new Date(a.metadata.createdAt)
    const dateB = new Date(b.metadata.createdAt)
    return dateB.getTime() - dateA.getTime()
  }).slice(0, 4)

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

function PostsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex justify-between items-start h-36">
          <div className="space-y-3 flex-1">
            <Skeleton className="h-6 w-[80%] mb-4" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-12 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-full w-1/2 rounded-md" />
        </div>
      ))}
    </div>
  )
}

export function PostsGrid({ postsPromise }: { postsPromise: Promise<Post[]> }) {
  return (
    <Suspense fallback={<PostsGridSkeleton />}>
      <PostsContent postsPromise={postsPromise} />
    </Suspense>
  )
}
