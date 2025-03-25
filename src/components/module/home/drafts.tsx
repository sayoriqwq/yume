'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import styles from '@/styles/modules/drafts.module.css'
import useSWR from 'swr'

import { ArticleRowItem } from '../post/post-row-item'
import { H1 } from './H1'
import { ReadMore } from './read-more'

interface Article {
  id: number
  title: string
  slug: string
  category: string
  description?: string
  cover?: string
  content: string
  viewCount: number
  published: boolean
  createdAt: string
  updatedAt: string
}

export function Drafts() {
  const { data: articles, isLoading, error } = useSWR<Article[]>(
    '/api/articles?type=DRAFT&take=5',
    (url: string) => fetch(url).then(res => res.json()),
  )

  const formattedArticles = articles?.map(article => ({
    ...article,
    createdAt: new Date(article.createdAt),
  })) || []

  if (isLoading) {
    return (
      <div className="flex flex-col gap-10">
        <div className="flex-between">
          <H1>Drafts</H1>
          <ReadMore link="/drafts" />
        </div>
        <ul>
          {Array.from({ length: 3 }).fill(0).map((_, i) => (
            <li key={i} className="flex items-center justify-between p-3">
              <Skeleton className="h-6 w-3/5" />
              <Skeleton className="h-4 w-20" />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-10">
        <div className="flex-between">
          <H1>Drafts</H1>
          <ReadMore link="/drafts" />
        </div>
        <div className="text-destructive-foreground">加载失败</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex-between">
        <H1>Drafts</H1>
        <ReadMore link="/drafts" />
      </div>
      {formattedArticles.length === 0
        ? (
            <div className="text-muted-foreground">暂无草稿</div>
          )
        : (
            <ul className={cn(styles['draft-list'], 'max-h-80')}>
              {formattedArticles.map(article => (
                <li key={article.id}>
                  <ArticleRowItem article={article} />
                </li>
              ))}
            </ul>
          )}
    </div>
  )
}
