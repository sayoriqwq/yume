import prisma from '@/db/prisma'

export async function deletePureTag(id: number) {
  return await prisma.tag.delete({
    where: { id },
  })
}

export async function deleteTag(id: number) {
  return await prisma.$transaction(async () => {
    // 1. 更新相关文章的 tagIds
    const articlesWithTag = await prisma.article.findMany({
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
      await prisma.article.update({
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
    await prisma.tag.delete({
      where: {
        id,
      },
    })
  })
}
