import { db } from '@/db'

export async function deletePureTag(id: number) {
  return await db.tag.delete({
    where: { id },
  })
}

export async function deleteTag(id: number) {
  return await db.$transaction(async () => {
    // 1. 更新相关文章的 tagIds
    const articlesWithTag = await db.article.findMany({
      where: {
        tags: {
          some: {
            id,
          },
        },
      },
      select: {
        id: true,
      },
    })

    for (const article of articlesWithTag) {
      await db.article.update({
        where: { id: article.id },
        data: {
          tags: {
            disconnect: {
              id,
            },
          },
        },
      })
    }

    // 2. 删除标签
    await db.tag.delete({
      where: {
        id,
      },
    })
  })
}
