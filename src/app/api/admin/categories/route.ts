import type { CategoriesResponse, NormalizedCategory } from '@/atoms/dashboard/types'
import type { SingleData } from '@/lib/api'
import type { NextRequest } from 'next/server'
import { normalizeCategories, normalizeCategory } from '@/atoms/normalize/category'
import { createSingleEntityResponse } from '@/lib/api'
import { parsePostBody } from '@/lib/parser'
import { createYumeErrorResponse, YumeError } from '@/lib/YumeError'
import { NextResponse } from 'next/server'
import { getCategories } from './get'
import { createCategory } from './post'
import { createCategorySchema } from './schema'

export async function GET(_request: NextRequest): Promise<NextResponse<CategoriesResponse | string>> {
  try {
    const categories = await getCategories()
    const normalized = normalizeCategories(categories)
    return NextResponse.json(normalized)
  }
  catch (error) {
    return createYumeErrorResponse(error)
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<SingleData<NormalizedCategory> | string>> {
  try {
    const input = await parsePostBody(request, createCategorySchema)

    if (input instanceof YumeError) {
      return NextResponse.json(input.toJSON())
    }

    const category = await createCategory(input)
    const normalized = normalizeCategory(category)
    return createSingleEntityResponse<NormalizedCategory>(normalized)
  }
  catch (error) {
    return createYumeErrorResponse(error)
  }
}
