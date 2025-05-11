import type { Article, Category } from '@/generated'
import type { CategoriesResponse, NormalizedCategory } from '../dashboard/types'

type CategoryInput = Category & {
  articles?: Article[]
}

export function normalizeCategory(category: CategoryInput): NormalizedCategory {
  const articleIds: number[] = []
  if (category.articles && category.articles.length > 0) {
    category.articles.forEach((article) => {
      articleIds.push(article.id)
    })
  }

  return {
    id: category.id,
    name: category.name,
    cover: category.cover,
    count: articleIds.length,
    articleIds,
  }
}

export function normalizeCategories(categories: CategoryInput[]): CategoriesResponse {
  const articles: Record<number, Article> = {}

  const processedData = categories.map((category) => {
    if (category.articles && category.articles.length > 0) {
      category.articles.forEach((article) => {
        articles[article.id] = article
      })
    }
    return normalizeCategory(category)
  })

  return {
    data: processedData,
    objects: {
      articles,
    },
  }
}
