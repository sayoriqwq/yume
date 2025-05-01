'server only'

import type { Prisma } from '@/generated'
import type { ArticleWithAllMetadata } from '@/types/article/article-model'
import type { ArticlesFilter } from './schema'
import { createYumeError, YumeErrorType } from '@/lib/YumeError'
import prisma from '../prisma'

/**
 * 安全地增加文章浏览量并返回更新后的数据
 */
export async function safeIncrementArticleViews(id: number) {
  const article = await getArticleById(id)

  if (!article) {
    throw createYumeError(new Error('文章不存在'), YumeErrorType.NotFoundError)
  }

  return prisma.article.update({
    where: { id: article.id },
    data: { viewCount: { increment: 1 } },
  })
}
/**
 * 获取文章列表
 */
export async function getArticles({
  page = 1,
  limit = 10,
  type,
  categoryId,
  tag,
  search,
  published = true,
}: ArticlesFilter = { page: 1, limit: 10 }) {
  // 构建查询条件
  const where: Prisma.ArticleWhereInput = {
    published,
  }

  // 应用过滤条件
  if (type) {
    where.type = type
  }

  if (categoryId) {
    where.categoryId = categoryId
  }

  if (tag) {
    where.tags = {
      some: { name: tag },
    }
  }

  // 搜索功能
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ]
  }

  // 计算分页
  const skip = (page - 1) * limit

  // 查询数据和总数
  const [articles, totalCount] = await prisma.$transaction([
    prisma.article.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        tags: true,
        _count: {
          select: {
            comments: { where: { status: 'APPROVED' } },
            likes: true,
          },
        },
      },
    }),
    prisma.article.count({ where }),
  ])

  // 计算分页信息
  const totalPages = Math.ceil(totalCount / limit)

  return {
    articles,
    meta: {
      currentPage: page,
      totalPages,
      totalCount,
      limit,
    },
  }
}

/**
 * 通过ID获取单篇文章
 */
export async function getArticleById(id: number) {
  const article = await prisma.article.findUnique({
    where: {
      id,
      published: true,
    },
    include: {
      category: true,
      tags: true,
      _count: {
        select: {
          comments: { where: { status: 'APPROVED' } },
          likes: true,
        },
      },
    },
  })

  return article
}

/**
 * 通过 slug 获取单篇文章详情
 */
export async function getArticleBySlug(slug: string): Promise<ArticleWithAllMetadata | null> {
  const article = await prisma.article.findUnique({
    where: {
      slug,
      published: true,
    },
    include: {
      category: true,
      tags: true,
      likes: true,
      comments: true,
      _count: {
        select: {
          likes: true,
          comments: {
            where: { status: 'APPROVED' },
          },
        },
      },
    },
  })

  return article
}

export async function getArticleIdBySlug(slug: string) {
  return await prisma.article.findUnique({
    where: {
      slug,
      published: true,
    },
    select: {
      id: true,
    },
  })
}
