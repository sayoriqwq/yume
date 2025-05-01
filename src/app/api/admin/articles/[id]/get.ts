'server only'

import prisma from '@/db/prisma'
import { createYumeError, YumeErrorType } from '@/lib/YumeError'

/**
 * 获取文章详情，包含所有关联数据
 * @param id 文章ID
 */
export async function getArticleDetail(id: number) {
  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      category: true,
      tags: true,
      comments: {
        where: {
          parentId: null, // 只获取顶层评论
          status: 'APPROVED', // 只获取已审核的评论
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              image_url: true,
            },
          },
          replies: {
            where: {
              status: 'APPROVED',
            },
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  image_url: true,
                },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (!article) {
    throw createYumeError(new Error(`文章ID ${id} 不存在`), YumeErrorType.NotFoundError)
  }

  // 获取文章的点赞数
  const likesCount = await prisma.like.count({
    where: {
      articleId: id,
    },
  })

  // 将点赞数附加到文章对象上
  return {
    ...article,
    likesCount,
  }
}

/**
 * 获取简化版文章详情（不包含评论等大量关联数据）
 * 用于编辑文章等场景
 */
export async function getArticleForEdit(id: number) {
  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      category: true,
      tags: true,
    },
  })

  if (!article) {
    throw createYumeError(new Error(`文章ID ${id} 不存在`), YumeErrorType.NotFoundError)
  }

  return article
}

/**
 * 递增文章的浏览量
 */
export async function incrementArticleViewCount(id: number) {
  await prisma.article.update({
    where: { id },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  })
}
