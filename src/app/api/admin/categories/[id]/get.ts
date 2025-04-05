import { db } from '@/db'

// 查询出某个分类下所有文章详细信息
// 这个接口在dashboard应该不会使用
export async function getCategoryDetail(id: number) {
  console.log('getCategoryDetail')
  const category = await db.category.findUnique({
    where: { id },
    include: {
      articles: true,
    },
  })

  return category
}
