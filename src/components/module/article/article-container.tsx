import type { ArticleWithAllMetadata } from '@/types/article/article-model'
import { TableOfContents } from '@/components/toc/toc'
import { WiderContainer } from '@/layout/container/Normal'
import { ArticleContent } from './article-content'
import { Category } from './category'
import { ArticleDescription } from './description'
import { EditedTime } from './edited-time'
import { ArticleInteractions } from './interactions'
import { LikeCount } from './like-count'
import { Tags } from './tags'
import { Title } from './title'
import { ViewCount } from './view-count'

interface ArticleContainerProps {
  article: ArticleWithAllMetadata
}

export function ArticleContainer({ article }: ArticleContainerProps) {
  return (
    <WiderContainer className="grid grid-cols-1 gap-20 xl:grid-cols-[1fr_300px] mt-16 bg-background">
      <div>
        <article className="prose dark:prose-invert">
          <Title title={article.title} />
          <div className="flex flex-col flex-center gap-2 mb-8 pb-4">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <EditedTime createdAt={article.createdAt} updatedAt={article.updatedAt} />
              </span>

              {article.category && (
                <Category category={article.category} />
              )}

              {article.tags && <Tags tags={article.tags} />}

              <div className="flex items-center gap-2">
                <ViewCount count={article.viewCount} />
                <LikeCount count={article._count.likes} />
              </div>
            </div>

            {article.description && <ArticleDescription description={article.description} />}
          </div>

          <ArticleContent article={article} />
        </article>
        <ArticleInteractions articleId={article.id} title={article.title} />
      </div>
      <div className="hidden xl:block">
        <TableOfContents />
      </div>
    </WiderContainer>
  )
}
