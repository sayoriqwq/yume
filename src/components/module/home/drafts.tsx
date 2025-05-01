'use client'

import type { ArticlesResponse } from '@/app/api/articles/route'
import type { Draft } from '@/types/article/article'
import { ScrollToShow } from '@/components/common/framer-animation/scroll-to-show'

import { NormalTime } from '@/components/common/time'
import { Skeleton } from '@/components/ui/skeleton'
import { ArticleType } from '@/generated'
import { cn } from '@/lib/utils'
import styles from '@/styles/modules/drafts.module.css'
import { formatArticle } from '@/types/article/format'
import Link from 'next/link'
import useSWR from 'swr'
import { H1 } from './H1'
import { ReadMore } from './read-more'

function DraftRowItem({ draft }: { draft: Draft }) {
  return (
    <ScrollToShow y={20}>
      <Link href={`/drafts/${draft.id}`} className="flex flex-col p-3 group">
        <article className="flex-between">
          <h2 className="font-heading relative line-clamp-1 w-fit max-w-64 text-xl group-hover:max-w-full transition-all duration-300">
            {draft.title}
          </h2>
          <NormalTime date={draft.createdAt} className="text-muted-foreground" />
        </article>
      </Link>
    </ScrollToShow>
  )
}

export function Drafts() {
  const { data, isLoading, error } = useSWR<ArticlesResponse>(
    `/api/articles?type=${ArticleType.DRAFT}&limit=5`,
  )

  const drafts = data?.articles?.map(article => formatArticle<Draft>(article)) || []

  const renderContent = () => {
    if (isLoading) {
      return (
        <ul>
          {Array.from({ length: 5 }).fill(0).map((_, i) => (
            <li key={i} className="flex items-center justify-between p-3">
              <Skeleton className="h-6 w-3/5" />
              <Skeleton className="h-4 w-20" />
            </li>
          ))}
        </ul>
      )
    }

    if (error) {
      return <div className="text-destructive-foreground">加载失败</div>
    }

    return drafts.length === 0
      ? <div className="text-muted-foreground">暂无草稿</div>
      : (
          <ul className={cn(styles['draft-list'], 'max-h-80')}>
            {drafts.map(draft => (
              <li key={draft.id}>
                <DraftRowItem draft={draft} />
              </li>
            ))}
          </ul>
        )
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex-between">
        <H1>Drafts</H1>
        <ReadMore link="/drafts" />
      </div>
      {renderContent()}
    </div>
  )
}
