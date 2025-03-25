// import type { Category } from '@/atoms/appData/store'
import { db } from '@/db'
import { NextResponse } from 'next/server'

// interface CategoryResponse {
//   data: {
//     categoryId: number
//   }
//   objects: {
//     categories: Record<number, Category>
//   }
// }

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params

  try {
    const category = await db.category.findUnique({
      where: { name },
    })

    if (!category) {
      return NextResponse.json({ error: '分类不存在' }, { status: 404 })
    }

    return NextResponse.json({
      data: {
        categoryId: category.id,
      },
      objects: {
        categories: {
          [category.id]: category,
        },
      },
    })
  }
  catch (error) {
    console.error('获取分类失败:', error)
    return NextResponse.json({ error: '获取分类失败' }, { status: 500 })
  }
}
