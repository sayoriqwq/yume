import { db } from '@/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const articles = await db.article.findMany({
      include: {
        category: true,
        tags: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(articles)
  }
  catch (error) {
    console.error('获取文章列表失败:', error)
    return NextResponse.json(
      { error: '获取文章列表失败' },
      { status: 500 },
    )
  }
}
