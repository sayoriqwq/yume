'use client'

import type { Post } from '#site/content'
import type { PropsWithCC } from '@/types/extend'
import Image from 'next/image'
import Link from 'next/link'
import { HoverBg } from '@/components/common/framer-animation/hover-bg'
import { ScrollToShow } from '@/components/common/framer-animation/scroll-to-show'
import { NormalTime } from '@/components/common/time'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

export function PostsGrid({ posts }: { posts: Post[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      {posts.map(post => (
        <HoverBg key={post.slug}>
          <ScrollToShow y={40}>
            <PostCard post={post} />
          </ScrollToShow>
        </HoverBg>
      ))}
    </div>
  )
}

function PostCard({ post, className }: { post: Post } & PropsWithCC) {
  const href = `posts/${post.slug}`

  return (
    <Link
      href={href}
      className={cn(
        'flex-between gap-6 rounded-lg p-6 transition-all',
        'group',
        className,
      )}
    >
      <div className="flex flex-col gap-2 px-2">
        <h3 className="text-foreground group-hover:text-accent-foreground line-clamp-2 text-xl font-semibold transition-colors">
          {post.title}
        </h3>
        <p className="text-muted-foreground mt-1 group-hover:text-accent-foreground/90 transition-colors">
          <NormalTime date={post.createdAt} />
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {post.tags?.map((tag) => {
            return (
              <span key={tag} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md">
                {tag}
              </span>
            )
          })}
        </div>
      </div>
      <div className="relative aspect-4/3 w-48 shrink-0 overflow-hidden rounded-lg transition-transform group-hover:shadow-lg">
        <Image
          src={post.cover || siteConfig.avatar}
          alt={post.title}
          fill
          className="object-cover transition-all duration-300 group-hover:scale-105"
        />
      </div>
    </Link>
  )
}
