import { db } from '@/db'
import { getMDXData } from './utils'

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

    await db.article.create({
      data: {
        slug: metadata.slug,
        title: metadata.title,
        description: metadata.description,
        cover: metadata.cover,
        type: 'BLOG',
        published: metadata.published ?? true,
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

    console.log(`成功导入文章: ${metadata.slug}`)
  }
}
