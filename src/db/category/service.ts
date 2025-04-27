'server only'

import { getArticles } from '../article/service'
import prisma from '../prisma'

/**
 * 通过分类名获取分类
 */
export async function getCategoryByName(name: string) {
  const category = await prisma.category.findUnique({
    where: { name },
  })
  return category
}

/**
 * 通过分类名获取该分类下的文章
 */
export async function getArticlesByCategoryName(
  name: string,
  options = { page: 1, limit: 10, published: true },
) {
  // 先查询分类
  const category = await getCategoryByName(name)

  if (!category) {
    return {
      articles: [],
      meta: {
        currentPage: options.page,
        totalPages: 0,
        totalCount: 0,
        limit: options.limit,
      },
    }
  }

  const result = await getArticles({
    categoryId: category.id,
    page: options.page,
    limit: options.limit,
    published: options.published,
  })

  return result
}
