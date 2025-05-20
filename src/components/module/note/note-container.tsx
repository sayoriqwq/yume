import type { ArticleWithAllMetadata } from '@/types/article/article-model'
import { TableOfContents } from '@/components/toc/toc'
import { WiderContainer } from '@/layout/container/Normal'
import { ArticleContent } from '../article/article-content'
import { Category } from '../article/category'
import { ArticleDescription } from '../article/description'
import { EditedTime } from '../article/edited-time'
import { ArticleInteractions } from '../article/interactions'
import { LikeCount } from '../article/like-count'
import { Title } from '../article/title'
import { ViewCount } from '../article/view-count'
import { NoteList } from './note-list'

interface NoteContainerProps {
  article: ArticleWithAllMetadata
}

export function NoteContainer({ article }: NoteContainerProps) {
  return (
    <WiderContainer className="grid grid-cols-1 gap-20 xl:grid-cols-[1fr_300px] mt-16 bg-background">
      <div>
        <article className="prose dark:prose-invert note-container">
          <div className="p-6 border-2 border-dashed rounded-xl border-primary/30 shadow-[0_5px_15px_rgba(var(--color-yume-blue-200),0.2)] dark:shadow-[0_5px_15px_rgba(var(--color-yume-blue-700),0.2)] relative">
            <Title title={article.title} />
            <div className="flex flex-col flex-center gap-2 mb-8 pb-4 border-b border-dotted border-primary/20">
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <EditedTime createdAt={article.createdAt} updatedAt={article.updatedAt} />
                </span>

                {article.weather && (
                  <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-100/40 dark:bg-blue-900/40 border border-blue-200/50 dark:border-blue-800/50 shadow-sm">
                    <span role="img" aria-label="weather">☁️</span>
                    {article.weather}
                  </span>
                )}

                {article.mood && (
                  <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-pink-100/40 dark:bg-pink-900/40 border border-pink-200/50 dark:border-pink-800/50 shadow-sm">
                    <span role="img" aria-label="mood">😊</span>
                    {article.mood}
                  </span>
                )}

                {article.location && (
                  <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-100/40 dark:bg-green-900/40 border border-green-200/50 dark:border-green-800/50 shadow-sm">
                    <span role="img" aria-label="location">📍</span>
                    {article.location}
                  </span>
                )}

                {article.category && (
                  <Category category={article.category} />
                )}

                <div className="flex items-center gap-2">
                  <ViewCount count={article.viewCount} />
                  <LikeCount count={article._count.likes} />
                </div>
              </div>

              {article.description && <ArticleDescription description={article.description} />}
            </div>

            <ArticleContent article={article} />
          </div>
        </article>
        <ArticleInteractions articleId={article.id} title={article.title} />
      </div>
      <div className="hidden xl:block">
        <TableOfContents />
        <NoteList activeNoteId={article.id} />
      </div>
    </WiderContainer>
  )
}
