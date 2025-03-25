import { db } from '@/db'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params

  try {
    const category = await db.category.findUnique({
      where: { name },
      include: {
        articles: {
          where: {
            published: true,
            type: 'BLOG',
          },
          include: {
            tags: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!category) {
      return NextResponse.json({ error: '分类不存在' }, { status: 404 })
    }

    // 简化响应结构，直接返回文章数组
    const articles = category.articles.map(article => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      description: article.description,
      category: {
        id: category.id,
        name: category.name,
        cover: category.cover,
      },
      tags: article.tags,
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
    }))

    return NextResponse.json({ articles })
  }
  catch (error) {
    console.error('获取分类文章失败:', error)
    return NextResponse.json({ error: '获取分类文章失败' }, { status: 500 })
  }
}
