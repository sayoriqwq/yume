import type { NextRequest } from 'next/server'
import { db } from '@/db'
import { NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')
    const take = Number(searchParams.get('take')) || undefined

    const articles = await db.article.findMany({
      where: {
        type: type as 'BLOG' | 'NOTE' | 'DRAFT' || undefined,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: true,
        tags: true,
        comments: true,
      },
      take,
    })

    console.log('articles', articles)

    if (!articles || articles.length === 0) {
      console.log(`Warning: No articles found with type: ${type}`)
    }

    // 格式化数据
    const formattedArticles = articles.map(article => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      category: article.category?.name || '未分类',
      description: article.description,
      cover: article.cover,
      content: article.content,
      type: article.type,
      viewCount: article.viewCount,
      published: article.published,
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
    }))

    return NextResponse.json(formattedArticles)
  }
  catch (error) {
    console.error('获取文章失败:', error)
    return NextResponse.json({ error: '获取文章失败' }, { status: 500 })
  }
}
