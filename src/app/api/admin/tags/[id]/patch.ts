import type { z } from 'zod'
import type { updateTagSchema } from '../schema'
import { db } from '@/db'

export async function updateTag(input: z.infer<typeof updateTagSchema>, id: number) {
  const { name, articleIds } = input

  // 如果提供了articleIds，则需要在事务中同时更新count
  if (articleIds !== undefined) {
    // 使用事务确保数据一致性
    return await db.$transaction(async (tx) => {
      // 更新标签基本信息以及文章关联
      const tag = await tx.tag.update({
        where: { id },
        data: {
          ...(name && { name }), // 如果提供了name则更新
          articles: {
            set: [], // 先清空现有关联
            connect: articleIds.map(articleId => ({ id: articleId })), // 重新建立关联
          },
          // 直接更新count为articleIds的长度
          count: articleIds.length,
        },
        include: {
          articles: {
            select: {
              id: true,
            },
          },
        },
      })

      return { tag }
    })
  }
  else {
    // 如果只是更新标签名称，不涉及文章关联
    const tag = await db.tag.update({
      where: { id },
      data: {
        name,
      },
      include: {
        articles: {
          select: {
            id: true,
          },
        },
      },
    })

    return { tag }
  }
}
