import fs from 'fs'
import path from 'path'
import { db } from '@/db'
import matter from 'gray-matter'

interface ImportOptions {
  sourceDir: string
  categoryId?: number
  tags?: string[]
}

export async function importMDXFiles({ sourceDir, categoryId, tags }: ImportOptions) {
  const files = fs.readdirSync(sourceDir)
  const mdxFiles = files.filter(file => file.endsWith('.mdx'))

  for (const file of mdxFiles) {
    const filePath = path.join(sourceDir, file)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(fileContent)
    const slug = file.replace('.mdx', '')

    // 检查是否已存在
    const existing = await db.article.findUnique({
      where: { slug },
    })

    if (existing) {
      console.log(`文章 ${slug} 已存在，跳过`)
      continue
    }

    // 创建或更新文章
    await db.article.create({
      data: {
        slug,
        title: data.title,
        description: data.description,
        cover: data.cover,
        type: 'BLOG',
        mdxPath: filePath,
        published: data.published ?? true,
        categoryId,
        tags: {
          connectOrCreate: tags?.map(tag => ({
            where: { name: tag },
            create: { name: tag },
          })) ?? [],
        },
      },
    })

    console.log(`成功导入文章: ${slug}`)
  }
}
