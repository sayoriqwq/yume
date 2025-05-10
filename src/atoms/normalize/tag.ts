import type { Article, Tag } from '@/generated'
import type { NormalizedTag, TagsResponse } from '../dashboard/types'

type TagInput = Tag & {
  articles?: Article[]
}

export function normalizeTag(tag: TagInput): NormalizedTag {
  const articleIds: number[] = []
  if (tag.articles && tag.articles.length > 0) {
    tag.articles.forEach((article) => {
      articleIds.push(article.id)
    })
  }

  return {
    id: tag.id,
    name: tag.name,
    count: articleIds.length,
    articleIds,
  }
}

export function normalizeTags(tags: TagInput[]): TagsResponse {
  const articles: Record<number, Article> = {}

  const processedData = tags.map((tag) => {
    if (tag.articles && tag.articles.length > 0) {
      tag.articles.forEach((article) => {
        articles[article.id] = article
      })
    }
    return normalizeTag(tag)
  })

  return {
    data: processedData,
    objects: {
      articles,
    },
  }
}
