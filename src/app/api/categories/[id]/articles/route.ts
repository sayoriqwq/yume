import type { Article } from '@/atoms/appData/store'
import { db } from '@/db'
import { NextResponse } from 'next/server'

interface CategoryArticlesResponse {
  data: {
    categoryId: number
    articleIds: number[]
  }
  objects: {
    articles: Record<number, Article>
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<CategoryArticlesResponse | { error: string }>> {
  const { id } = await params
  const categoryId = Number(id)

  try {
    const category = await db.category.findUnique({
      where: { id: categoryId },
      include: {
        articles: {
          include: {
            category: true,
          },
        },
      },
    })

    if (!category) {
      return NextResponse.json({ error: '分类不存在' }, { status: 404 })
    }

    // 规范化响应结构
    const articleIds = category.articles.map(article => article.id)
    const articlesData = category.articles.reduce<Record<number, Article>>((acc, article) => {
      acc[article.id] = {
        ...article,
        category: article.category.name,
        createdAt: article.createdAt.toISOString(),
        updatedAt: article.updatedAt.toISOString(),
      } as Article
      return acc
    }, {})

    return NextResponse.json({
      data: {
        categoryId: category.id,
        articleIds,
      },
      objects: {
        articles: articlesData,
      },
    })
  }
  catch (error) {
    console.error('获取分类文章失败:', error)
    return NextResponse.json({ error: '获取分类文章失败' }, { status: 500 })
  }
}
