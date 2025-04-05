import { DEFAULT_CATEGORY_ID } from '@/constants/category'
import { db } from '@/db'

export async function deletePureCategory(id: number) {
  return await db.category.delete({
    where: { id },
  })
}

export async function deleteCategory(id: number) {
  return await db.$transaction(async () => {
    // 1. 更新相关文章的 categoryId
    await db.article.updateMany({
      where: {
        categoryId: id,
      },
      data: {
        categoryId: DEFAULT_CATEGORY_ID,
      },
    })

    // 2. 删除分类
    await db.category.delete({
      where: {
        id,
      },
    })
  })
}
