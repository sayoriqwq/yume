import { db } from '@/db'
import { createYumeError, YumeErrorType } from '@/lib/YumeError'
import { LikeableType } from '@prisma/client'

export function deletePureArticle(id: number) {
  return db.article.delete({
    where: { id },
  })
}

export async function deleteArticle(id: number) {
  // 首先获取文章信息，以便更新相关计数
  const article = await db.article.findUnique({
    where: { id },
    include: {
      tags: true,
      category: true,
    },
  })

  if (!article) {
    const error = new Error(`文章ID ${id} 不存在`)
    throw createYumeError(error, YumeErrorType.NotFoundError)
  }

  // 使用事务确保数据一致性
  return await db.$transaction(async (tx) => {
    // 1. 删除与文章相关的点赞记录
    await tx.like.deleteMany({
      where: {
        type: LikeableType.ARTICLE,
        targetId: id,
      },
    })

    // 2. 更新相关分类的文章计数
    if (article.categoryId) {
      await tx.category.update({
        where: { id: article.categoryId },
        data: {
          count: { decrement: 1 },
        },
      })
    }

    // 3. 更新相关标签的文章计数
    if (article.tags.length > 0) {
      for (const tag of article.tags) {
        await tx.tag.update({
          where: { id: tag.id },
          data: {
            count: { decrement: 1 },
          },
        })
      }
    }

    // 4. 删除文章（评论会通过 onDelete: Cascade 自动删除）
    return await tx.article.delete({
      where: { id },
    })
  })
}
