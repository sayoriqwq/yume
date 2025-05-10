'server only'

import type { z } from 'zod'
import type { updateTagSchema } from '../schema'
import prisma from '@/db/prisma'

export async function updateTag(input: z.infer<typeof updateTagSchema>, id: number) {
  const { name, articleIds } = input

  // 如果提供了articleIds，则需要在事务中同时更新count
  if (articleIds !== undefined) {
    return await prisma.$transaction(async (tx) => {
      // 更新标签基本信息以及文章关联
      const tag = await tx.tag.update({
        where: { id },
        data: {
          ...(name && { name }), // 如果提供了name则更新
          articles: {
            set: articleIds?.map(id => ({ id })) || [],
          },
          count: articleIds.length,
        },
        include: {
          articles: true,
        },
      })

      return tag
    })
  }
  else {
    // 如果只是更新标签名称，不涉及文章关联
    const tag = await prisma.tag.update({
      where: { id },
      data: {
        name,
      },
      include: {
        articles: true,
      },
    })
    return tag
  }
}
