import type { Post } from '#site/content'
import Image from 'next/image'
import { NormalTime } from '@/components/common/time'
import { DEFAULT_BLOG_COVER } from '@/constants/defaults'
import { getTagMap } from '@/data/tag'
import { cn } from '@/lib/utils'
import { Tag } from './tag'

export interface BlogPostCardProps {
  post: Post
  className?: string
}

export function BlogPostCard({ post, className, ...props }: BlogPostCardProps) {
  const cover = post.cover || DEFAULT_BLOG_COVER
  const tagMap = getTagMap()

  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-xl p-4 bg-background-secondary/20 transition-shadow duration-300 hover:shadow-lg',
        className,
      )}
      {...props}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
        <Image
          src={cover}
          alt={post.title}
          sizes="( max-width: 768px ) 100vw, ( max-width: 1200px ) 50vw, 33vw"
          priority
          fill
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
        />
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-3">
        <NormalTime date={post.updatedAt || post.createdAt} className="text-sm uppercase tracking-wide text-text-tertiary" />

        <h3 className="text-xl font-semibold leading-snug text-text line-clamp-2">{post.title}</h3>

        <p className="text-sm text-text-secondary line-clamp-2">{post.description}</p>

        {post.tags?.length
          ? (
              <ul className="mt-auto flex flex-wrap gap-2">
                {post.tags.map((tagSlug) => {
                  const tag = tagMap[tagSlug]
                  const label = tag?.title ?? tagSlug

                  return (
                    <li key={tagSlug}>
                      <Tag>{label}</Tag>
                    </li>
                  )
                })}
              </ul>
            )
          : null}
      </div>
    </article>
  )
}
