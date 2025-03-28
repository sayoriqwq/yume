import type { NextRequest } from 'next/server'
import { db } from '@/db'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const idNumber = Number.parseInt(id)
    const data = await request.json()

    const updatedCategory = await db.category.update({
      where: { id: idNumber },
      data,
    })

    return NextResponse.json({
      data: {
        categoryIds: [idNumber],
      },
      objects: {
        categories: {
          [idNumber]: updatedCategory,
        },
      },
    })
  }
  catch (error) {
    console.error('更新分类失败:', error)
    return NextResponse.json(
      { error: '更新分类失败' },
      { status: 500 },
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const idNumber = Number.parseInt(id)

    // 删除分类
    await db.category.delete({
      where: { id: idNumber },
    })

    // 获取剩余的分类ID列表
    const categories = await db.category.findMany({
      select: { id: true },
    })

    const categoryIds = categories.map(c => c.id)
    const categoriesObject = Object.fromEntries(
      categories.map(category => [category.id, category]),
    )

    return NextResponse.json({
      data: {
        categoryIds,
      },
      objects: {
        categories: categoriesObject,
      },
    })
  }
  catch (error) {
    console.error('删除分类失败:', error)
    return NextResponse.json(
      { error: '删除分类失败' },
      { status: 500 },
    )
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const idNumber = Number.parseInt(id)

    const category = await db.category.findUnique({
      where: { id: idNumber },
      include: {
        articles: true,
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: '分类不存在' },
        { status: 404 },
      )
    }

    const articleIds = category.articles.map(article => article.id)

    return NextResponse.json({
      data: {
        categoryIdToArticleIds: {
          [idNumber]: articleIds,
        },
      },
      objects: {
        categories: {
          [idNumber]: category,
        },
      },
    })
  }
  catch (error) {
    console.error('获取分类失败:', error)
    return NextResponse.json(
      { error: '获取分类失败' },
      { status: 500 },
    )
  }
}
