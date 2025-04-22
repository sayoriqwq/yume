import { db } from '@/db'
import { getMDXData } from './server-utils'

interface ImportOptions {
  sourceDir: string
}

export async function importMDXFiles({ sourceDir }: ImportOptions) {
  const posts = getMDXData(sourceDir)

  for (const post of posts) {
    const { metadata } = post

    // 检查是否已存在
    const existing = await db.article.findUnique({
      where: { slug: metadata.slug },
    })

    if (existing) {
      console.log(`文章 ${metadata.slug} 已存在，跳过`)
      continue
    }

    // 使用事务确保数据一致性
    await db.$transaction(async (tx) => {
      // 创建文章
      await tx.article.create({
        data: {
          slug: metadata.slug,
          title: metadata.title,
          description: metadata.description,
          cover: metadata.cover,
          type: 'BLOG',
          published: metadata.published ?? true,
          content: JSON.stringify(post.content),
          category: {
            connectOrCreate: {
              where: { name: metadata.category },
              create: { name: metadata.category },
            },
          },
          tags: {
            connectOrCreate: metadata.tags?.map(tag => ({
              where: { name: tag },
              create: { name: tag },
            })) ?? [],
          },
        },
      })

      // 更新分类的文章计数
      await tx.category.update({
        where: { name: metadata.category },
        data: { count: { increment: 1 } },
      })

      // 更新所有关联标签的计数
      if (metadata.tags && metadata.tags.length > 0) {
        for (const tagName of metadata.tags) {
          await tx.tag.update({
            where: { name: tagName },
            data: { count: { increment: 1 } },
          })
        }
      }
    })

    console.log(`成功导入文章: ${metadata.slug}`)
  }
}
