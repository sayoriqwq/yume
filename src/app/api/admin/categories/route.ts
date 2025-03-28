import type { Category } from '@/atoms/dashboard/types'
import type { NextRequest } from 'next/server'
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
      throw new Error('没有分类')
    }

    // 规范化响应结构
    const categoriesData = categories.reduce<Record<number, Category>>((acc, category) => {
      acc[category.id] = category as Category
      return acc
    }, {})

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

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const newCategory = await db.category.create({
      data,
    })

    // 获取所有分类ID
    const categories = await db.category.findMany({
      select: { id: true },
    })

    return NextResponse.json({
      data: {
        categoryIds: categories.map(c => c.id),
      },
      objects: {
        categories: {
          [newCategory.id]: newCategory,
        },
      },
    })
  }
  catch (error) {
    console.error('创建分类失败:', error)
    return NextResponse.json(
      { error: '创建分类失败' },
      { status: 500 },
    )
  }
}
