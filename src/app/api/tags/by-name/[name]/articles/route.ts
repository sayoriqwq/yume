import { db } from '@/db'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params

  try {
    const tag = await db.tag.findUnique({
      where: { name },
      include: {
        articles: {
          where: {
            published: true,
          },
          include: {
            category: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!tag) {
      return NextResponse.json({ error: '标签不存在' }, { status: 404 })
    }

    const articles = tag.articles.map(article => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      description: article.description,
      category: article.category,
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
    }))

    return NextResponse.json({ articles })
  }
  catch (error) {
    console.error('获取标签文章失败:', error)
    return NextResponse.json({ error: '获取标签文章失败' }, { status: 500 })
  }
}
