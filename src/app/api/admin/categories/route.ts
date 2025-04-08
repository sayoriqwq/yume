import type { Category } from '@/atoms/dashboard/types'
import type { SingleData } from '@/lib/api'
import type { NextRequest } from 'next/server'
import { createSingleEntityResponse } from '@/lib/api'
import { parsePostBody } from '@/lib/parser'
import { YumeError } from '@/lib/YumeError'
import { NextResponse } from 'next/server'
import { getCategories } from './get'
import { createCategory } from './post'
import { createCategorySchema } from './schema'

export interface CategoriesApiResponse {
  data: {
    categoryIds: number[]
  }
  objects: {
    categories: Record<number, Category>
    categoryIdToArticleIds: Record<number, number[]>
  }
}

export async function GET(_request: NextRequest): Promise<NextResponse<CategoriesApiResponse | string>> {
  const res = await getCategories()
  const { categories } = res

  const categoriesMap = categories.reduce((acc, category) => {
    acc[category.id] = category
    return acc
  }, {} as Record<number, Category>)

  const categoryIdToArticleIds = categories.reduce((acc, category) => {
    acc[category.id] = category.articles.map(article => article.id)
    return acc
  }, {} as Record<number, number[]>)

  return NextResponse.json<CategoriesApiResponse>({
    data: {
      categoryIds: categories.map(category => category.id),
    },
    objects: {
      categories: categoriesMap,
      categoryIdToArticleIds,
    },
  })
}

export async function POST(request: NextRequest): Promise<NextResponse<SingleData<Category> | string>> {
  const input = await parsePostBody(request, createCategorySchema)

  if (input instanceof YumeError) {
    return NextResponse.json(input.toJSON())
  }

  const { category } = await createCategory(input)

  return createSingleEntityResponse<Category>(category)
}
