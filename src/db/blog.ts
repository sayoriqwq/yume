import { db } from '@/db'

interface BlogResponse {
  id: number
  title: string
  slug: string
  description: string | null
  cover: string | null
  type: string
  viewCount: number
  content: string | null
  mood: string | null
  weather: string | null
  location: string | null
  categoryId: number | null
  published: boolean
  createdAt: Date
  updatedAt: Date
  category: {
    id: number
    name: string
    cover: string | null
    count: number
  } | null
  tags: Array<{
    id: number
    name: string
    count: number
  }>
}

export async function getBlogs(): Promise<BlogResponse[]> {
  return await db.article.findMany({
    where: {
      published: true,
      type: 'BLOG',
    },
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
      tags: true,
    },
  })
}

export async function getBlogBySlug(slug: string) {
  return db.article.findUnique({
    where: { slug, published: true, type: 'BLOG' },
    include: {
      category: true,
      tags: true,
    },
  })
}

export async function getBlogsByCategory(categoryId: number) {
  return await db.article.findMany({
    where: {
      categoryId,
      published: true,
      type: 'BLOG',
    },
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
      tags: true,
    },
  })
}

export async function getBlogsByTag(tagId: number) {
  return await db.article.findMany({
    where: {
      tags: { some: { id: tagId } },
      published: true,
      type: 'BLOG',
    },
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
      tags: true,
    },
  })
}

export async function getCategories() {
  return await db.category.findMany({
    include: {
      _count: {
        select: { articles: true },
      },
    },
  })
}

export async function getTags() {
  return await db.tag.findMany({
    include: {
      _count: {
        select: { articles: true },
      },
    },
  })
}

export async function incrementViewCount(id: number) {
  return await db.article.update({
    where: { id },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  })
}
