'server only'

// 查询出某个分类下所有文章详细信息

import prisma from '@/db/prisma'

// 这个接口在dashboard应该不会使用
export async function getCategoryDetail(id: number) {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      articles: true,
    },
  })

  return category
}
