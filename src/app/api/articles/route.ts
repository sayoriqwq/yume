import { db } from '@/db'
import { currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const ArticleSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  slug: z.string().min(1, 'slug不能为空'),
  description: z.string().optional(),
  cover: z.string().optional(),
  mdxPath: z.string().optional(),
  categoryId: z.number().optional(),
  tagIds: z.array(z.number()).optional(),
  published: z.boolean().default(true),
})

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

export async function POST(request: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = ArticleSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors.map(err => err.message).join('\n') },
        { status: 400 },
      )
    }

    const { tagIds, ...data } = validationResult.data

    const article = await db.article.create({
      data: {
        ...data,
        type: 'BLOG',
        tags: tagIds
          ? {
              connect: tagIds.map(id => ({ id })),
            }
          : undefined,
      },
      include: {
        category: true,
        tags: true,
      },
    })

    return NextResponse.json(article)
  }
  catch (error) {
    console.error('创建文章失败:', error)
    return NextResponse.json(
      { error: '创建文章失败' },
      { status: 500 },
    )
  }
}
