import type { Category } from '@/atoms/appData/store'
import { db } from '@/db'
import { NextResponse } from 'next/server'

interface CategoriesResponse {
  data: {
    categoryIds: number[]
  }
  objects: {
    categories: Record<number, Category>
  }
}

export async function GET(): Promise<NextResponse<CategoriesResponse | { error: string }>> {
  try {
    const categories = await db.category.findMany()

    if (!categories || categories.length === 0) {
      console.log('Warning: No categories found in database')
    }

    // 规范化响应结构
    const categoriesData = categories.reduce<Record<number, Category>>((acc, category) => {
      acc[category.id] = category
      return acc
    }, {})

    console.log('API Response - categories count:', categories.length)

    return NextResponse.json({
      data: {
        categoryIds: categories.map(category => category.id),
      },
      objects: {
        categories: categoriesData,
      },
    })
  }
  catch (error) {
    console.error('获取分类失败:', error)
    return NextResponse.json({ error: '获取分类失败' }, { status: 500 })
  }
}
