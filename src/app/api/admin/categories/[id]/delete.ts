import { DEFAULT_CATEGORY_ID } from '@/constants/defaults'
import prisma from '@/db/prisma'

export async function deletePureCategory(id: number) {
  return await prisma.category.delete({
    where: { id },
  })
}

export async function deleteCategory(id: number) {
  return await prisma.$transaction(async () => {
    // 1. 更新相关文章的 categoryId
    await prisma.article.updateMany({
      where: {
        categoryId: id,
      },
      data: {
        categoryId: DEFAULT_CATEGORY_ID,
      },
    })

    // 2. 删除分类
    await prisma.category.delete({
      where: {
        id,
      },
    })
  })
}
