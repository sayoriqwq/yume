import type { Article, Category } from '@/atoms/appData/store'
import { db } from '@/db'
import { NextResponse } from 'next/server'

interface TagArticlesResponse {
  data: {
    tagId: number
    articleIds: number[]
  }
  objects: {
    articles: Record<number, Article>
    categories: Record<number, Category>
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<TagArticlesResponse | { error: string }>> {
  const { id } = await params
  const tagId = Number(id)

  try {
    const tag = await db.tag.findUnique({
      where: { id: tagId },
      include: {
        articles: {
          include: {
            category: true,
          },
        },
      },
    })

    if (!tag) {
      return NextResponse.json({ error: '标签不存在' }, { status: 404 })
    }

    // 规范化响应结构 - 文章
    const articleIds = tag.articles.map(article => article.id)
    const articlesData = tag.articles.reduce<Record<number, Article>>((acc, article) => {
      acc[article.id] = {
        ...article,
        category: article.category.name,
        createdAt: article.createdAt.toISOString(),
        updatedAt: article.updatedAt.toISOString(),
      } as Article
      return acc
    }, {})

    // 规范化响应结构 - 分类
    const categoriesData = tag.articles.reduce<Record<number, Category>>((acc, article) => {
      if (article.category) {
        acc[article.category.id] = {
          ...article.category,
          cover: article.category.cover || undefined,
        } as Category
      }
      return acc
    }, {})

    return NextResponse.json({
      data: {
        tagId: tag.id,
        articleIds,
      },
      objects: {
        articles: articlesData,
        categories: categoriesData,
      },
    })
  }
  catch (error) {
    console.error('获取标签文章失败:', error)
    return NextResponse.json({ error: '获取标签文章失败' }, { status: 500 })
  }
}
