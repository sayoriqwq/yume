import type { z } from 'zod'
import type { updateTagSchema } from '../schema'
import { db } from '@/db'

export async function updateTag(input: z.infer<typeof updateTagSchema>, id: number) {
  const { name, articleIds } = input

  // 更新标签基本信息
  const tag = await db.tag.update({
    where: { id },
    data: {
      name,
      // 如果提供了articleIds，则同时更新标签与文章的关联关系
      ...(articleIds && {
        articles: {
          set: [], // 先清空现有关联
          connect: articleIds.map(articleId => ({ id: articleId })), // 重新建立关联
        },
      }),
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
