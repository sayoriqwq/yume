import { db } from '@/db'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  try {
    // 确保params.name已正确解析
    const { name } = await params
    const tagName = decodeURIComponent(name)

    // 查找标签
    const tag = await db.tag.findUnique({
      where: { name: tagName },
    })

    if (!tag) {
      return NextResponse.json(
        { error: '标签不存在' },
        { status: 404 },
      )
    }

    // 获取所有带有这个标签的文章
    const articles = await db.article.findMany({
      where: {
        tags: {
          some: {
            id: tag.id,
          },
        },
        published: true,
      },
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
    console.error('获取标签文章失败:', error)
    return NextResponse.json(
      { error: '获取标签文章失败' },
      { status: 500 },
    )
  }
}
