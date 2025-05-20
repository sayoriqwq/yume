'server only'

import prisma from '@/db/prisma'
import dayjs from 'dayjs'
import { getMDXData } from './posts-utils'

interface ImportOptions {
  sourceDir: string
}

// 根据文件路径确定文章类型
function determineArticleType(filePath: string | undefined) {
  if (!filePath)
    return 'DRAFT'

  const normalizedPath = filePath.toLowerCase()

  if (normalizedPath.includes('/blogs/'))
    return 'BLOG'
  if (normalizedPath.includes('/drafts/'))
    return 'DRAFT'
  if (normalizedPath.includes('/notes/'))
    return 'NOTE'

  return 'BLOG' // 默认类型
}

export async function importMDXFiles({ sourceDir }: ImportOptions) {
  const posts = await getMDXData(sourceDir)

  for (const post of posts) {
    const { metadata } = post

    // 检查是否已存在
    const existing = await prisma.article.findUnique({
      where: { slug: metadata.slug },
    })

    if (existing) {
      console.log(`文章 ${metadata.slug} 已存在，跳过`)
      continue
    }

    // 根据文件路径确定文章类型
    const articleType = determineArticleType(metadata.filePath)

    // 使用事务确保数据一致性
    await prisma.$transaction(async (tx) => {
      // 创建文章
      await tx.article.create({
        data: {
          slug: metadata.slug,
          title: metadata.title,
          description: metadata.description,
          cover: metadata.cover,
          type: articleType,
          published: metadata.published ?? true,
          content: post.content,
          mdxPath: metadata.filePath ?? '',
          createdAt: metadata.createdAt ? dayjs(metadata.createdAt).toDate() : new Date(),
          updatedAt: metadata.updatedAt ? dayjs(metadata.updatedAt).toDate() : new Date(),
          category: {
            connectOrCreate: {
              where: { name: metadata.category || '未分类' },
              create: { name: metadata.category || '未分类' },
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
