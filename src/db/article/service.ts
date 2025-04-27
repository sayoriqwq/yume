'server only'

import type { Prisma } from '@/generated'
import type { ArticlesFilter } from './schema'
import { LikeableType } from '@/generated'
import { createYumeError, YumeErrorType } from '@/lib/YumeError'
import prisma from '../prisma'

/**
 * 通过ID或slug获取文章
 */
export async function getArticleByIdOrSlug(idOrSlug: string | number) {
  if (typeof idOrSlug === 'number' || /^\d+$/.test(idOrSlug)) {
    const id = typeof idOrSlug === 'number' ? idOrSlug : Number.parseInt(idOrSlug)
    return await getArticleById(id)
  }
  else {
    return await getArticleBySlug(idOrSlug)
  }
}

/**
 * 安全地增加文章浏览量并返回更新后的数据
 */
export async function safeIncrementArticleViews(idOrSlug: string | number) {
  const article = await getArticleByIdOrSlug(idOrSlug)

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
          likes: { where: { type: LikeableType.ARTICLE } },
        },
      },
    },
  })

  return article
}

/**
 * 通过Slug获取单篇文章
 */
export async function getArticleBySlug(slug: string) {
  return await prisma.article.findUnique({
    where: {
      slug,
      published: true,
    },
    include: {
      category: true,
      tags: true,
      _count: {
        select: {
          comments: { where: { status: 'APPROVED' } },
          likes: { where: { type: LikeableType.ARTICLE } },
        },
      },
    },
  })
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
