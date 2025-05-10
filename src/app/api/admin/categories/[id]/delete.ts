'server only'

import { DEFAULT_CATEGORY_ID } from '@/constants/defaults'
import prisma from '@/db/prisma'
import { createYumeError, YumeErrorType } from '@/lib/YumeError'

export async function deletePureCategory(id: number) {
  return await prisma.category.delete({
    where: { id },
  })
}

export async function deleteCategory(id: number) {
  if (id === DEFAULT_CATEGORY_ID) {
    throw createYumeError('无法删除默认分类', YumeErrorType.BadRequestError)
  }
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
