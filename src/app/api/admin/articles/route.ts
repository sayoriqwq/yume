import type { Article } from '@/atoms/dashboard/types'
import { db } from '@/db'
import { NextResponse } from 'next/server'

interface ArticlesResponse {
  data: {
    articleIds: number[]
  }
  objects: {
    articles: Record<number, Article>
  }
}

// 获取文章列表
export async function GET(): Promise<NextResponse<ArticlesResponse | { error: string }>> {
  try {
    const articles = await db.article.findMany({
      include: {
        category: true,
        tags: true,
      },
    })

    const articleData = articles.reduce<Record<number, Article>>((acc, article) => {
      acc[article.id] = article as Article
      return acc
    }, {})

    const articleIds = articles.map(article => article.id)
    const categoryId = articles.map(article => article.categoryId)
    const tagIds = articles.map(article => article.tags.map(tag => tag.id))
    const articleIdToCategoryId = articleIds.map(id => ({
      [id]: categoryId,
    }))
    const articleIdToTagIds = articleIds.map(id => ({
      [id]: tagIds,
    }))

    return NextResponse.json({
      data: {
        articleIds,
        articleIdToCategoryId,
        articleIdToTagIds,
      },
      objects: {
        articles: articleData,
      },
    })
  }
  catch (error) {
    console.error('获取文章列表失败:', error)
    return NextResponse.json(
      { error: '获取文章列表失败' },
      { status: 500 },
    )
  }
}
