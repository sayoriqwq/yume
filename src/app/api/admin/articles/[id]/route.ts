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

    console.log('idNumber', idNumber)
    console.log('data', data)

    // 如果更改了分类，需要更新两个分类的计数
    if (data.categoryId) {
      // 先获取当前文章
      const currentArticle = await db.article.findUnique({
        where: { id: idNumber },
        select: { categoryId: true },
      })

      if (currentArticle && currentArticle.categoryId !== data.categoryId) {
        // 减少原分类的计数
        await db.category.update({
          where: { id: currentArticle.categoryId },
          data: { count: { decrement: 1 } },
        })

        // 增加新分类的计数
        await db.category.update({
          where: { id: data.categoryId },
          data: { count: { increment: 1 } },
        })
      }
    }

    const updatedArticle = await db.article.update({
      where: { id: idNumber },
      data,
      include: {
        category: true,
        tags: true,
      },
    })

    // 按照前端需要的格式返回数据
    return NextResponse.json({
      data: {
        articleIds: [idNumber],
      },
      objects: {
        articles: {
          [idNumber]: updatedArticle,
        },
      },
    })
  }
  catch (error) {
    console.error('更新文章失败:', error)
    return NextResponse.json(
      { error: '更新文章失败' },
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

    // 获取文章信息用于更新分类计数
    const article = await db.article.findUnique({
      where: { id: idNumber },
      select: { categoryId: true },
    })

    // 删除文章
    await db.article.delete({
      where: { id: idNumber },
    })

    // 更新分类计数
    if (article) {
      await db.category.update({
        where: { id: article.categoryId },
        data: { count: { decrement: 1 } },
      })
    }

    // 获取剩余的文章ID列表
    const articles = await db.article.findMany({
      select: { id: true },
    })

    return NextResponse.json({
      data: {
        articleIds: articles.map(a => a.id),
      },
      success: true,
    })
  }
  catch (error) {
    console.error('删除文章失败:', error)
    return NextResponse.json(
      { error: '删除文章失败' },
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

    const article = await db.article.findUnique({
      where: { id: idNumber },
      include: {
        category: true,
        tags: true,
      },
    })

    if (!article) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      data: {
        articleIds: [idNumber],
      },
      objects: {
        articles: {
          [idNumber]: article,
        },
      },
    })
  }
  catch (error) {
    console.error('获取文章失败:', error)
    return NextResponse.json(
      { error: '获取文章失败' },
      { status: 500 },
    )
  }
}
