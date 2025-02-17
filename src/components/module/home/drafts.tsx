'use client'

import type { Post } from '@/types/post'
import { cn } from '@/lib/utils'
import styles from '@/styles/modules/drafts.module.css'
import { DraftItem } from './draft-item'
import { H1 } from './H1'
import { ReadMore } from './read-more'

interface Props {
  posts: Post[]
}

export function Drafts({ posts }: Props) {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex-between">
        <H1>Drafts</H1>
        <ReadMore link="/posts?category=drafts" />
      </div>
      <ul className={cn(styles['draft-list'], 'max-h-80')}>
        {posts.map(post => (
          <li key={post.slug}>
            <DraftItem post={post} />
          </li>
        ))}
      </ul>
    </div>
  )
}
