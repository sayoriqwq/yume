'use client'

import { ScrollToShow } from '@/components/common/framer-animation/scroll-to-show'
import { NormalTime } from '@/components/common/time'
import Link from 'next/link'

interface Article {
  title: string
  slug: string
  category: string
  createdAt: Date
}

interface ArticleRowProps {
  article: Article
}

export function ArticleRowItem({ article }: ArticleRowProps) {
  return (
    <ScrollToShow y={20}>
      <Link href={`/posts/${article.category}/${article.slug}`} className="flex flex-col p-3 group">
        <article className="flex-between">
          <h2 className="font-heading relative line-clamp-1 w-fit max-w-64 text-xl group-hover:max-w-full transition-all duration-300">
            {article.title}
          </h2>
          <NormalTime date={article.createdAt} className="text-muted-foreground" />
        </article>
      </Link>
    </ScrollToShow>
  )
}
