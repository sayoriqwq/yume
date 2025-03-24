import type { Article } from '@/atoms/appData/store'
import { db } from '@/db'
import { NextResponse } from 'next/server'

interface ArticleResponse {
  data: {
    articleId: number
  }
  objects: {
    articles: Record<number, Article>
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse<ArticleResponse | { error: string }>> {
  const { slug } = await params

  try {
    const article = await db.article.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    })

    if (!article) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 })
    }

    // 格式化日期
    const formattedArticle = {
      ...article,
      category: article.category?.name,
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
    } as Article

    return NextResponse.json({
      data: {
        articleId: article.id,
      },
      objects: {
        articles: {
          [article.id]: formattedArticle,
        },
      },
    })
  }
  catch (error) {
    console.error('获取文章失败:', error)
    return NextResponse.json({ error: '获取文章失败' }, { status: 500 })
  }
}
