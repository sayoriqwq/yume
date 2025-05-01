import type { ArticleWithAllMetadata } from '@/types/article/article-model'
import { Category } from './category'
import { ArticleDescription } from './description'
import { EditedTime } from './edited-time'
import { LikeCount } from './like-count'
import { Tags } from './tags'
import { ViewCount } from './view-count'

interface ArticleMetadataProps {
  article: ArticleWithAllMetadata
}

export function ArticleMetadata({ article }: ArticleMetadataProps) {
  return (
    <div className="flex-center flex-col text-center gap-2">
      <div>
        <span className="flex flex-wrap items-center gap-2">
          <EditedTime createdAt={article.createdAt} updatedAt={article.updatedAt} />
          {article.category && (
            <Category category={article.category} />
          )}
          {article.tags && <Tags tags={article.tags} />}
          <ViewCount count={article.viewCount} />
          <LikeCount count={article._count.likes} />
        </span>
      </div>
      {article.description && <ArticleDescription description={article.description} />}
    </div>
  )
}
